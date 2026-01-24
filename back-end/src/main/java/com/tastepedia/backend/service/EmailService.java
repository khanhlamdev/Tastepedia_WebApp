package com.tastepedia.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("khanhphantk@gmail.com"); // Email người gửi (trùng với config)
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
        System.out.println("Đã gửi mail thành công tới: " + toEmail);
    }

    public void sendPasswordChangeOTP(String toEmail, String otp) {
        String subject = "Mã OTP đổi mật khẩu - Tastepedia";
        String body = "Xin chào,\n\n" +
                "Bạn đã yêu cầu đổi mật khẩu tài khoản Tastepedia.\n\n" +
                "Mã OTP của bạn là: " + otp + "\n\n" +
                "Mã này có hiệu lực trong 10 phút.\n\n" +
                "Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\n" +
                "Tastepedia Team";
        
        sendEmail(toEmail, subject, body);
    }
}