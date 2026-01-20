package com.tastepedia.backend.payload;

public class VerifyRequest {
    private String email;
    private String otp;

    // --- Các hàm Getter và Setter (để lấy và gán dữ liệu) ---

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}