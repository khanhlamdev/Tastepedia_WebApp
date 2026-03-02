package com.tastepedia.backend.repository;

import com.tastepedia.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Lấy tất cả thông báo của user, mới nhất trước
    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(String recipientUserId);

    // Đếm thông báo chưa đọc
    long countByRecipientUserIdAndIsReadFalse(String recipientUserId);

    // Xóa tất cả thông báo của user
    void deleteByRecipientUserId(String recipientUserId);
}
