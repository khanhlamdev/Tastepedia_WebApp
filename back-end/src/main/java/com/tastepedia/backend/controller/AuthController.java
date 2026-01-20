package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.User;
import com.tastepedia.backend.payload.GoogleRequest;
import com.tastepedia.backend.payload.SignupRequest;
import com.tastepedia.backend.payload.VerifyRequest;
import com.tastepedia.backend.repository.UserRepository;
import com.tastepedia.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.tastepedia.backend.payload.LoginRequest; // Nhớ import cái này
import java.util.Optional;
import java.util.UUID; // Nhớ đảm bảo bạn đã làm Bước 4 của câu trả lời trước (Tạo EmailService)


@RestController
@RequestMapping("/api/auth") // Đường dẫn chung: http://localhost:8080/api/auth
// Cho phép cả cổng 3000 (React cũ) và 5173 (Vite mới) cho chắc ăn
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}) // QUAN TRỌNG: Cho phép React (cổng 5173) gọi sang
public class AuthController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;
    // API Đăng ký: POST /api/auth/signup
    @Autowired
    EmailService emailService; // Nhớ đảm bảo bạn đã làm Bước 4 của câu trả lời trước (Tạo EmailService)


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody String email) {
        // Vì client gửi string thô, đôi khi nó dính dấu ngoặc kép, cần lọc sạch
        String cleanEmail = email.replace("\"", "").trim();

        Optional<User> userOptional = userRepository.findByEmail(cleanEmail);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Email không tồn tại trong hệ thống!");
        }

        User user = userOptional.get();

        // 1. Tạo mật khẩu mới ngẫu nhiên (lấy 8 ký tự đầu của UUID)
        String newPassword = UUID.randomUUID().toString().substring(0, 8);

        // 2. Mã hóa và Lưu mật khẩu mới vào DB
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 3. Gửi mật khẩu mới qua Email
        emailService.sendEmail(
                cleanEmail,
                "Cấp lại mật khẩu - Tastepedia",
                "Chào bạn " + user.getFullName() + ",\n\nMật khẩu mới của bạn là: " + newPassword + "\n\nVui lòng đăng nhập và đổi lại mật khẩu ngay."
        );

        return ResponseEntity.ok("Mật khẩu mới đã được gửi tới email của bạn!");
    }
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Lỗi: Email này đã được sử dụng!");
        }

        // Tạo mã OTP ngẫu nhiên 6 số
        String randomOtp = String.valueOf((int) ((Math.random() * 900000) + 100000));

        User user = new User();
        user.setFullName(signUpRequest.getFullName());
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.isWantsToBeCreator() ? "CREATOR" : "USER");

        user.setOtpCode(randomOtp); // Lưu OTP
        user.setVerified(false);    // Mặc định là chưa kích hoạt

        userRepository.save(user);

        // Gửi OTP qua Email
        emailService.sendEmail(
                user.getEmail(),
                "Mã xác thực đăng ký Tastepedia",
                "Chào " + user.getUsername() + ",\n\nMã OTP của bạn là: " + randomOtp + "\n\nMã này dùng để kích hoạt tài khoản."
        );

        return ResponseEntity.ok("Đã gửi mã OTP về email. Vui lòng kiểm tra!");
    }
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        // 1. Tìm user
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Email không tồn tại!");
        }

        User user = userOptional.get();


        // Thêm đoạn này:
        if (!user.isVerified()) {
            return ResponseEntity.badRequest().body("Tài khoản chưa được xác thực! Vui lòng kiểm tra email.");
        }
        // 2. SO SÁNH MẬT KHẨU (Dùng matches thay vì equals)
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Lỗi: Sai mật khẩu!");
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyRequest verifyRequest) {
        Optional<User> userOptional = userRepository.findByEmail(verifyRequest.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Email không tồn tại!");
        }

        User user = userOptional.get();

        // Kiểm tra OTP
        if (user.getOtpCode() != null && user.getOtpCode().equals(verifyRequest.getOtp())) {
            user.setVerified(true); // Kích hoạt tài khoản
            user.setOtpCode(null);  // Xóa OTP đi cho sạch
            userRepository.save(user);
            return ResponseEntity.ok("Kích hoạt tài khoản thành công! Bạn có thể đăng nhập.");
        } else {
            return ResponseEntity.badRequest().body("Mã OTP không đúng!");
        }
    }

    // API Xử lý Google (Chung cho cả Login và Signup)
    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody GoogleRequest request) {

        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        // --- TRƯỜNG HỢP 1: ĐANG Ở TAB ĐĂNG NHẬP (LOGIN) ---
        if (request.getType().equals("LOGIN")) {
            if (userOptional.isEmpty()) {
                // Chưa đăng ký mà đòi đăng nhập -> CHẶN
                return ResponseEntity.badRequest().body("Email này chưa đăng ký Google! Vui lòng chuyển sang tab Sign Up.");
            }
            // Đã có -> Cho vào
            return ResponseEntity.ok(userOptional.get());
        }

        // --- TRƯỜNG HỢP 2: ĐANG Ở TAB ĐĂNG KÝ (SIGNUP) ---
        else if (request.getType().equals("SIGNUP")) {
            if (userOptional.isPresent()) {
                // Đã đăng ký rồi mà đăng ký lại -> CHẶN
                return ResponseEntity.badRequest().body("Email này đã tồn tại! Vui lòng chuyển sang Log In.");
            }

            // Chưa có -> Tạo mới
            User newUser = new User();
            newUser.setEmail(request.getEmail());
            newUser.setFullName(request.getFullName());
            newUser.setGoogleId(request.getGoogleId());
            newUser.setAuthProvider("GOOGLE");
            newUser.setRole("USER"); // Mặc định
            newUser.setVerified(true); // Google thì coi như đã xác thực luôn, ko cần OTP

            // Vì dùng Google nên không có mật khẩu, ta set một chuỗi ngẫu nhiên cho an toàn
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

            userRepository.save(newUser);
            return ResponseEntity.ok(newUser);
        }

        return ResponseEntity.badRequest().body("Loại yêu cầu không hợp lệ");
    }
}