package com.tastepedia.backend.payload;

public class GoogleRequest {
    private String email;
    private String fullName;
    private String googleId;
    private String type; // "LOGIN" hoặc "SIGNUP"

    // Getter & Setter bạn tự thêm nhé (Alt + Insert)
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}