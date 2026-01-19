package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.User;
import com.tastepedia.backend.payload.SignupRequest;
import com.tastepedia.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tastepedia.backend.payload.LoginRequest; // Nhớ import cái này
import java.util.Optional;

@RestController
@RequestMapping("/api/auth") // Đường dẫn chung: http://localhost:8080/api/auth
// Cho phép cả cổng 3000 (React cũ) và 5173 (Vite mới) cho chắc ăn
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}) // QUAN TRỌNG: Cho phép React (cổng 5173) gọi sang
public class AuthController {

    @Autowired
    UserRepository userRepository;

    // API Đăng ký: POST /api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {

        // 1. Kiểm tra xem Email đã có trong DB chưa
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Lỗi: Email này đã được sử dụng rồi!");
        }

        // 2. Xác định quyền (Role) dựa vào checkbox
        String role = signUpRequest.isWantsToBeCreator() ? "CREATOR" : "USER";

        // 3. Tạo đối tượng User mới
        User user = new User(
                signUpRequest.getEmail(),
                signUpRequest.getPassword(), // Lưu ý: Tạm thời lưu pass thường, sau này sẽ mã hóa sau
                signUpRequest.getFullName(),
                role
        );

        // 4. Lưu vào MongoDB
        userRepository.save(user);

        return ResponseEntity.ok("Đăng ký thành công!");
    }
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        // 1. Tìm user trong DB theo email
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        // 2. Nếu không tìm thấy user
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Email không tồn tại!");
        }

        User user = userOptional.get();

        // 3. Kiểm tra mật khẩu (So sánh chuỗi thường)
        // Lưu ý: Sau này làm bảo mật thật sẽ dùng BCrypt để so sánh, giờ so sánh thô trước
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.badRequest().body("Lỗi: Sai mật khẩu!");
        }

        // 4. Nếu đúng hết -> Trả về thông tin User (hoặc Token sau này)
        return ResponseEntity.ok(user);
    }
}