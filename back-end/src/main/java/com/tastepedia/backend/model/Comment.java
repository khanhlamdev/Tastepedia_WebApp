package com.tastepedia.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "post_comments")
public class Comment {
    @Id
    private String id;
    private String postId;
    private String userId;
    private String authorName;
    private String authorAvatar;
    private String content;
    private List<String> images; // URLs của các ảnh (tối đa 10)
    private LocalDateTime createdAt;

    private int likes;
    private List<String> likedUserIds;
    private int reportCount; // Theo dõi số lượng báo cáo vi phạm

    // Hỗ trợ trả lời bình luận (Reply)
    private List<Comment> replies;

    public Comment() {
        this.createdAt = LocalDateTime.now();
        this.likes = 0;
        this.reportCount = 0;
        this.likedUserIds = new ArrayList<>();
        this.replies = new ArrayList<>();
        this.images = new ArrayList<>();
    }

    // Getters Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getAuthorAvatar() { return authorAvatar; }
    public void setAuthorAvatar(String authorAvatar) { this.authorAvatar = authorAvatar; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }
    public List<String> getLikedUserIds() { return likedUserIds; }
    public void setLikedUserIds(List<String> likedUserIds) { this.likedUserIds = likedUserIds; }
    public List<Comment> getReplies() { return replies; }
    public void setReplies(List<Comment> replies) { this.replies = replies; }
    public int getReportCount() { return reportCount; }
    public void setReportCount(int reportCount) { this.reportCount = reportCount; }
}