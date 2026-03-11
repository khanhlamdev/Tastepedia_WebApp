package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.User;
import com.tastepedia.backend.payload.GoogleRequest;
import com.tastepedia.backend.payload.LoginRequest;
import com.tastepedia.backend.payload.SignupRequest;
import com.tastepedia.backend.payload.VerifyRequest;
import com.tastepedia.backend.repository.UserRepository;
import com.tastepedia.backend.service.EmailService;
import com.tastepedia.backend.service.OtpCacheService;
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
// CORS is handled globally by SimpleCorsFilter + CorsConfig (supports Vercel + localhost)
public class AuthController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailService emailService;

    @Autowired
    OtpCacheService otpCacheService;

    // --- 1. API QUÊN MẬT KHẨU (Gửi OTP) ---
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody String email) {
        String cleanEmail = email.replace("\"", "").trim();

        Optional<User> userOptional = userRepository.findByEmail(cleanEmail);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Email không tồn tại trong hệ thống!");
        }

        User user = userOptional.get();
        // Generate OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        
        user.setOtpCode(otp);
        userRepository.save(user);

        emailService.sendEmail(
                cleanEmail,
                "Mã OTP Khôi phục mật khẩu - Tastepedia",
                "Chào bạn " + user.getFullName() + ",\n\nMã OTP khôi phục mật khẩu của bạn là: " + otp + "\n\nMã này có hiệu lực để đặt lại mậtkhẩu."
        );

        return ResponseEntity.ok("Mã OTP đã được gửi tới email của bạn!");
    }

    // --- 1.1 API XÁC NHẬN OTP & ĐỔI MẬT KHẨU (Dành cho Forgot Password) ---
    @PostMapping("/reset-password-verify")
    public ResponseEntity<?> resetPasswordVerify(@RequestBody com.tastepedia.backend.payload.ResetPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Email không tồn tại!");
        }

        User user = userOptional.get();

        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Mã OTP không đúng hoặc đã hết hạn!");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setOtpCode(null); // Xóa OTP sau khi dùng
        userRepository.save(user);

        return ResponseEntity.ok("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
    }

    // --- 2. API ĐĂNG KÝ (Gửi OTP) ---
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Lỗi: Email này đã được sử dụng!");
        }
        
        // Check trùng username
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
             return ResponseEntity.badRequest().body("Lỗi: Username này đã được sử dụng!");
        }

        String randomOtp = String.valueOf((int) ((Math.random() * 900000) + 100000));

        // --- KHÔNG LƯU VÀO DATABASE NGAY ---
        // Lưu tạm vào RAM cache đợi xác thực OTP.
        otpCacheService.savePendingUser(signUpRequest.getEmail(), signUpRequest, randomOtp);

        emailService.sendEmail(
                signUpRequest.getEmail(),
                "Mã xác thực đăng ký Tastepedia",
                "Chào " + signUpRequest.getUsername() + ",\n\nMã OTP của bạn là: <strong>" + randomOtp + "</strong>\n\nMã này có hiệu lực trong 10 phút."
        );

        return ResponseEntity.ok("Đã gửi mã OTP về email. Vui lòng kiểm tra!");
    }

    // --- 3. API ĐĂNG NHẬP THƯỜNG (CÓ LƯU SESSION) ---
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest, HttpSession session) {
        // Find by USERNAME instead of Email
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Username không tồn tại!");
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
        // KIỂM TRA OTP TRONG CACHE THAY VÌ MONGODB
        OtpCacheService.PendingUser pendingUser = otpCacheService.getPendingUser(verifyRequest.getEmail());

        if (pendingUser == null) {
            return ResponseEntity.badRequest().body("Email không có yêu cầu đăng ký hoặc yêu cầu đã hết hạn!");
        }

        if (pendingUser.otp.equals(verifyRequest.getOtp())) {
            SignupRequest signUpRequest = pendingUser.request;

            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                otpCacheService.removePendingUser(verifyRequest.getEmail());
                return ResponseEntity.badRequest().body("Tài khoản này đã được xác thực trước đó!");
            }

            // LƯU VÀO DB
            User user = new User();
            user.setFullName(signUpRequest.getFullName());
            user.setUsername(signUpRequest.getUsername());
            user.setEmail(signUpRequest.getEmail());
            user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
            user.setRole(signUpRequest.isWantsToBeCreator() ? "CREATOR" : "USER");
            user.setVerified(true);
            user.setAuthProvider("LOCAL");

            userRepository.save(user);

            // Xóa cache sau khi dùng
            otpCacheService.removePendingUser(verifyRequest.getEmail());

            return ResponseEntity.ok("Kích hoạt tài khoản thành công! Bạn có thể đăng nhập.");
        } else {
            return ResponseEntity.badRequest().body("Mã OTP không đúng!");
        }
    }

    // --- 7. API GOOGLE LOGIN/SIGNUP (ĐÃ CẬP NHẬT SESSION) ---
    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody GoogleRequest request, HttpSession session) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Nếu tài khoản đã tồn tại, tự động cập nhật googleId nếu trường này trống
            if (user.getGoogleId() == null) {
                user.setGoogleId(request.getGoogleId());
                userRepository.save(user);
            }
        } else {
            // Tạo user mới
            user = new User();
            user.setEmail(request.getEmail());
            // Tạo username duy nhất từ email
            String baseUsername = request.getEmail().split("@")[0];
            String finalUsername = baseUsername;
            int counter = 1;
            while (userRepository.existsByUsername(finalUsername)) {
                finalUsername = baseUsername + counter;
                counter++;
            }
            user.setUsername(finalUsername);
            user.setFullName(request.getFullName());
            user.setGoogleId(request.getGoogleId());
            user.setAuthProvider("GOOGLE");
            user.setRole("USER");
            user.setVerified(true);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            userRepository.save(user);
        }

        // === LƯU SESSION GOOGLE ===
        session.setAttribute("MY_SESSION_USER", user);
        session.setMaxInactiveInterval(30 * 60);

        return ResponseEntity.ok(user);
    }
}