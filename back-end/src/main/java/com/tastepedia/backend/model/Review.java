package com.tastepedia.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "reviews")
public class Review {
    @Id
    private String id;

    private String recipeId; // ID của món ăn đang được review
    private String userId;   // ID của người dùng review
    private String username; // Lưu tên hiển thị (để đỡ phải query lại bảng User)
    private String avatar;   // Lưu ký tự avatar (VD: "SM", "DC")
    private int rating;      // 1-5 sao
    private String comment;
    private LocalDateTime createdAt;
    private int helpfulCount; // Số lượt thấy hữu ích
    private boolean isVerified; // Người dùng đã xác thực (verified cook)

    // Constructor mặc định
    public Review() {
        this.createdAt = LocalDateTime.now();
        this.helpfulCount = 0;
    }

    // Constructor đầy đủ
    public Review(String recipeId, String userId, String username, String avatar, int rating, String comment, boolean isVerified) {
        this.recipeId = recipeId;
        this.userId = userId;
        this.username = username;
        this.avatar = avatar;
        this.rating = rating;
        this.comment = comment;
        this.isVerified = isVerified;
        this.createdAt = LocalDateTime.now();
        this.helpfulCount = 0;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRecipeId() { return recipeId; }
    public void setRecipeId(String recipeId) { this.recipeId = recipeId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public int getHelpfulCount() { return helpfulCount; }
    public void setHelpfulCount(int helpfulCount) { this.helpfulCount = helpfulCount; }
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }
}