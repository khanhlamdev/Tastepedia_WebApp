package com.tastepedia.backend.payload;

public class SignupRequest {
    private String fullName;
    private String email;
    private String password;
    private boolean wantsToBeCreator; // Hứng cái checkbox "I want to be Creator"

    // --- Getters và Setters (Bắt buộc phải có để Spring đọc được dữ liệu) ---
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public boolean isWantsToBeCreator() { return wantsToBeCreator; }
    public void setWantsToBeCreator(boolean wantsToBeCreator) { this.wantsToBeCreator = wantsToBeCreator; }
}