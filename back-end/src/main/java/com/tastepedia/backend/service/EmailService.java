package com.tastepedia.backend.service;

import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    private final String RESEND_API_KEY = "re_GhAS1G91_ChAWQYPREAbs8D7ZgDRqjsmT";

    public void sendEmail(String toEmail, String subject, String body) {
        try {
            // Escape newlines for valid JSON and HTML
            String safeBody = body.replace("\"", "\\\"").replace("\n", "<br>");
            
            String jsonPayload = "{"
                    + "\"from\": \"onboarding@resend.dev\","
                    + "\"to\": [\"" + toEmail + "\"],"
                    + "\"subject\": \"" + subject + "\","
                    + "\"html\": \"<p>" + safeBody + "</p>\""
                    + "}";

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + RESEND_API_KEY)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                System.out.println("Đã gửi OTP qua API Resend thành công tới: " + toEmail);
            } else {
                System.err.println("Lỗi gửi Resend API (HTTP " + response.statusCode() + "): " + response.body());
                System.err.println("LƯU Ý QUAN TRỌNG: Vi chua add Domain nen Resend Free CHỈ cho phep gui toi Email dang ky tai khoan Resend!");
            }
        } catch (Exception e) {
            System.err.println("Lỗi Exception khi gọi API Resend: " + e.getMessage());
        }
    }

    public void sendPasswordChangeOTP(String toEmail, String otp) {
        String subject = "Mã OTP đổi mật khẩu - Tastepedia";
        String body = "Xin chào,\n\n" +
                "Bạn đã yêu cầu đổi mật khẩu tài khoản Tastepedia.\n\n" +
                "Mã OTP của bạn là: <strong>" + otp + "</strong>\n\n" +
                "Mã này có hiệu lực trong 10 phút.\n\n" +
                "Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\n" +
                "Tastepedia Team";
        
        sendEmail(toEmail, subject, body);
    }
}