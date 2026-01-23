package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.User;
import com.tastepedia.backend.payload.GoogleRequest;
import com.tastepedia.backend.payload.LoginRequest;
import com.tastepedia.backend.payload.SignupRequest;
import com.tastepedia.backend.payload.VerifyRequest;
import com.tastepedia.backend.repository.UserRepository;
import com.tastepedia.backend.service.EmailService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession; // Import Session
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
// Cho phép gửi Cookie (Session ID) qua lại giữa 2 cổng khác nhau
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailService emailService;

    // --- 1. API QUÊN MẬT KHẨU ---
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody String email) {
        String cleanEmail = email.replace("\"", "").trim();

        Optional<User> userOptional = userRepository.findByEmail(cleanEmail);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Email không tồn tại trong hệ thống!");
        }

        User user = userOptional.get();
        String newPassword = UUID.randomUUID().toString().substring(0, 8);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        emailService.sendEmail(
                cleanEmail,
                "Cấp lại mật khẩu - Tastepedia",
                "Chào bạn " + user.getFullName() + ",\n\nMật khẩu mới của bạn là: " + newPassword + "\n\nVui lòng đăng nhập và đổi lại mật khẩu ngay."
        );

        return ResponseEntity.ok("Mật khẩu mới đã được gửi tới email của bạn!");
    }

    // --- 2. API ĐĂNG KÝ (Gửi OTP) ---
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Lỗi: Email này đã được sử dụng!");
        }

        String randomOtp = String.valueOf((int) ((Math.random() * 900000) + 100000));

        User user = new User();
        user.setFullName(signUpRequest.getFullName());
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.isWantsToBeCreator() ? "CREATOR" : "USER");
        user.setOtpCode(randomOtp);
        user.setVerified(false);

        userRepository.save(user);

        emailService.sendEmail(
                user.getEmail(),
                "Mã xác thực đăng ký Tastepedia",
                "Chào " + user.getUsername() + ",\n\nMã OTP của bạn là: " + randomOtp
        );

        return ResponseEntity.ok("Đã gửi mã OTP về email. Vui lòng kiểm tra!");
    }

    // --- 3. API ĐĂNG NHẬP THƯỜNG (CÓ LƯU SESSION) ---
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest, HttpSession session) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Email không tồn tại!");
        }

        User user = userOptional.get();

        if (!user.isVerified()) {
            return ResponseEntity.badRequest().body("Tài khoản chưa được xác thực! Vui lòng kiểm tra email.");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Lỗi: Sai mật khẩu!");
        }

        // === LƯU VÀO SESSION ===
        session.setAttribute("MY_SESSION_USER", user);
        session.setMaxInactiveInterval(30 * 60); // 30 phút

        return ResponseEntity.ok(user);
    }

    // --- 4. API KIỂM TRA SESSION (Dùng khi F5 trang) ---
    @GetMapping("/me")
    public ResponseEntity<?> checkSession(HttpSession session) {
        User user = (User) session.getAttribute("MY_SESSION_USER");
        if (user == null) {
            return ResponseEntity.status(401).body("Chưa đăng nhập hoặc phiên đã hết hạn");
        }
        return ResponseEntity.ok(user);
    }

    // --- 5. API ĐĂNG XUẤT (HỦY SESSION) ---
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session, HttpServletResponse response) {
        // 1. Hủy session trên server (Dữ liệu phiên làm việc bị xóa)
        session.invalidate();

        // 2. Tạo một Cookie "chết" để gửi về Client
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/"); // Đường dẫn phải trùng với cookie gốc
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0); // QUAN TRỌNG: 0 nghĩa là xóa ngay lập tức

        // 3. Gắn cookie này vào phản hồi
        response.addCookie(cookie);

        return ResponseEntity.ok("Đăng xuất thành công và đã xóa Cookie!");
    }

    // --- 6. API XÁC THỰC OTP ---
    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyRequest verifyRequest) {
        Optional<User> userOptional = userRepository.findByEmail(verifyRequest.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Email không tồn tại!");
        }

        User user = userOptional.get();

        if (user.getOtpCode() != null && user.getOtpCode().equals(verifyRequest.getOtp())) {
            user.setVerified(true);
            user.setOtpCode(null);
            userRepository.save(user);
            return ResponseEntity.ok("Kích hoạt tài khoản thành công! Bạn có thể đăng nhập.");
        } else {
            return ResponseEntity.badRequest().body("Mã OTP không đúng!");
        }
    }

    // --- 7. API GOOGLE LOGIN/SIGNUP (ĐÃ CẬP NHẬT SESSION) ---
    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody GoogleRequest request, HttpSession session) { // Thêm tham số session

        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        // --- TRƯỜNG HỢP 1: ĐANG Ở TAB ĐĂNG NHẬP (LOGIN) ---
        if (request.getType().equals("LOGIN")) {
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Email này chưa đăng ký Google! Vui lòng chuyển sang tab Sign Up.");
            }

            User user = userOptional.get();

            // === LƯU SESSION LOGIN GOOGLE ===
            session.setAttribute("MY_SESSION_USER", user);
            session.setMaxInactiveInterval(30 * 60);

            return ResponseEntity.ok(user);
        }

        // --- TRƯỜNG HỢP 2: ĐANG Ở TAB ĐĂNG KÝ (SIGNUP) ---
        else if (request.getType().equals("SIGNUP")) {
            if (userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("Email này đã tồn tại! Vui lòng chuyển sang Log In.");
            }

            // Tạo user mới
            User newUser = new User();
            newUser.setEmail(request.getEmail());
            newUser.setFullName(request.getFullName());
            newUser.setGoogleId(request.getGoogleId());
            newUser.setAuthProvider("GOOGLE");
            newUser.setRole("USER");
            newUser.setVerified(true);
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

            userRepository.save(newUser);

            // === LƯU SESSION SIGNUP GOOGLE (Tự đăng nhập luôn) ===
            session.setAttribute("MY_SESSION_USER", newUser);
            session.setMaxInactiveInterval(30 * 60);

            return ResponseEntity.ok(newUser);
        }

        return ResponseEntity.badRequest().body("Loại yêu cầu không hợp lệ");
    }
}