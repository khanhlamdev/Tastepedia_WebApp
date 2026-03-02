package com.tastepedia.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Bảng lưu tất cả thông báo của người dùng.
 * type: LIKE_POST | LIKE_COMMENT | COMMENT_POST | REPLY_COMMENT | SYSTEM | ORDER | PROMO
 */
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String recipientUserId; // Người nhận thông báo
    private String type;            // Loại thông báo (enum string)
    private String actorName;       // Người thực hiện hành động
    private String actorAvatar;     // Avatar của người thực hiện
    private String message;         // Nội dung thông báo (VD: "Nguyễn Văn A đã thích bài viết của bạn")
    private String link;            // Đường dẫn điều hướng khi click (VD: "/community")
    private boolean isRead;         // false = chưa đọc
    private LocalDateTime createdAt;

    public Notification() {
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters & Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRecipientUserId() { return recipientUserId; }
    public void setRecipientUserId(String recipientUserId) { this.recipientUserId = recipientUserId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }

    public String getActorAvatar() { return actorAvatar; }
    public void setActorAvatar(String actorAvatar) { this.actorAvatar = actorAvatar; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
