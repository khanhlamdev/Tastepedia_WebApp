package com.tastepedia.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users") // Đánh dấu đây là bảng 'users' trong MongoDB
public class User {

    @Id
    private String id; // MongoDB tự tạo ID này

    private String email;
    private String password;
    private String fullName;
    private String role; // Lưu quyền: "USER" hoặc "CREATOR"
    private String username; // Thêm tên đăng nhập
    private String otpCode;  // Lưu mã OTP tạm thời
    private boolean verified; // false = chưa xác thực, true = đã xác thực
    // --- Constructor (Hàm khởi tạo) ---
    // Trong file User.java
    private String authProvider; // Giá trị sẽ là "LOCAL" (thường) hoặc "GOOGLE"
    private String googleId;     // Lưu ID của Google (để sau này phân biệt)
    public User() {}

    public User(String email, String password, String fullName, String role, String username, String otpCode, boolean verified ,String authProvider, String googleId) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.username = username;
        this.otpCode = otpCode;
        this.verified = verified;
        this.authProvider = authProvider;
        this.googleId = googleId;
    }

    public String getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}