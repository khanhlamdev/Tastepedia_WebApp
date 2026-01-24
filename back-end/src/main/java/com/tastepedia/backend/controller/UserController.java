package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.User;
import com.tastepedia.backend.repository.UserRepository;
import com.tastepedia.backend.service.CloudinaryService;
import com.tastepedia.backend.service.EmailService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // --- LẤY THÔNG TIN PROFILE HIỆN TẠI ---
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        // Lấy user mới nhất từ DB
        User user = userRepository.findById(currentUser.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy user!");
        }

        // Tạo response không bao gồm password
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("profileImageUrl", user.getProfileImageUrl());
        response.put("verified", user.isVerified());
        
        // New fields
        response.put("phone", user.getPhone());
        response.put("address", user.getAddress());
        response.put("bio", user.getBio());

        return ResponseEntity.ok(response);
    }

    // --- CẬP NHẬT THÔNG TIN PROFILE ---
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        User user = userRepository.findById(currentUser.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy user!");
        }

        // Cập nhật các trường
        if (updates.containsKey("fullName")) user.setFullName(updates.get("fullName"));
        if (updates.containsKey("phone")) user.setPhone(updates.get("phone"));
        if (updates.containsKey("address")) user.setAddress(updates.get("address"));
        if (updates.containsKey("bio")) user.setBio(updates.get("bio"));

        // Không cho phép đổi Username/Email ở đây nữa (Read-only)

        userRepository.save(user);
        
        // Cập nhật session
        session.setAttribute("MY_SESSION_USER", user);

        return ResponseEntity.ok("Cập nhật thông tin thành công!");
    }
    
    // --- ĐỔI MẬT KHẨU (Biết mật khẩu cũ) ---
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Vui lòng nhập đầy đủ thông tin!");
        }

        User user = userRepository.findById(currentUser.getId()).orElse(null);
        
        // Check mật khẩu cũ
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu hiện tại không đúng!");
        }

        // Đổi mật khẩu
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }

    // --- UPLOAD AVATAR ---
    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("avatar") MultipartFile file, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        try {
            User user = userRepository.findById(currentUser.getId()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(404).body("Không tìm thấy user!");
            }

            // Upload lên Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file);
            
            // Cập nhật URL vào database
            user.setProfileImageUrl(imageUrl);
            userRepository.save(user);

            // Cập nhật session
            session.setAttribute("MY_SESSION_USER", user);

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi upload ảnh: " + e.getMessage());
        }
    }

    // --- YÊU CẦU ĐỔI MẬT KHẨU (GỬI OTP) ---
    @PostMapping("/change-password-request")
    public ResponseEntity<?> requestPasswordChange(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        User user = userRepository.findById(currentUser.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy user!");
        }

        // Tạo OTP 6 số
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // Lưu OTP vào database
        user.setOtpCode(otp);
        userRepository.save(user);

        // Gửi email
        try {
            emailService.sendPasswordChangeOTP(user.getEmail(), otp);
            return ResponseEntity.ok("Mã OTP đã được gửi đến email của bạn!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi gửi email: " + e.getMessage());
        }
    }

    // --- XÁC NHẬN ĐỔI MẬT KHẨU VỚI OTP ---
    @PostMapping("/change-password-confirm")
    public ResponseEntity<?> confirmPasswordChange(@RequestBody Map<String, String> request, HttpSession session) {
        // ... (Logíc xác nhận OTP giữ nguyên như cũ hoặc chỉnh sửa nếu cần, nhưng flow quên mật khẩu dùng API khác)
        // Lưu ý: Flow "Quên mật khẩu" dùng AuthController, còn đây là User đã đăng nhập muốn đổi pass bằng OTP
        
        // Để đơn giản, ta tái sử dụng logic
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        // ... (Logic cũ)
        
         if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

         if (otp == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Thiếu thông tin!");
        }

        User user = userRepository.findById(currentUser.getId()).orElse(null);
        
        if (!otp.equals(user.getOtpCode())) {
            return ResponseEntity.badRequest().body("Mã OTP không đúng!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtpCode(null); 
        userRepository.save(user);

        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }
}
