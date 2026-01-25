package com.tastepedia.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "community_posts")
public class CommunityPost {
    @Id
    private String id;

    private String type; // "post", "question", "tip", "poll"
    private String content;
    private List<String> images; // URLs của các ảnh (tối đa 10)
    private List<String> tags;

    // Thông tin người đăng (lưu gọn để đỡ query)
    private String userId;
    private String authorName;
    private String authorAvatar;
    private String authorBadge; // VD: "Master Chef", "Home Cook"

    private LocalDateTime createdAt;

    // Tương tác
    private int likes;
    private int comments;
    private List<String> likedUserIds; // Danh sách ID người đã like

    // Dành riêng cho Poll
    private PollData poll;

    public CommunityPost() {
        this.createdAt = LocalDateTime.now();
        this.likes = 0;
        this.comments = 0;
        this.tags = new ArrayList<>();
        this.likedUserIds = new ArrayList<>();
        this.images = new ArrayList<>();
    }

    // Inner class cho Poll
    public static class PollData {
        private String question;
        private List<PollOption> options;
        private int totalVotes;
        private java.util.Map<String, Integer> userVotes;
        // Constructors, Getters, Setters
        public PollData() {
            this.userVotes = new java.util.HashMap<>();
        }
        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }
        public List<PollOption> getOptions() { return options; }
        public void setOptions(List<PollOption> options) { this.options = options; }
        public int getTotalVotes() { return totalVotes; }
        public void setTotalVotes(int totalVotes) { this.totalVotes = totalVotes; }
        public java.util.Map<String, Integer> getUserVotes() { return userVotes; }
        public void setUserVotes(java.util.Map<String, Integer> userVotes) { this.userVotes = userVotes; }
    }

    public static class PollOption {
        private int id; // 1, 2, 3...
        private String text;
        private int votes;

        public PollOption() {}
        public PollOption(int id, String text) {
            this.id = id;
            this.text = text;
            this.votes = 0;
        }
        // Getters, Setters
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public int getVotes() { return votes; }
        public void setVotes(int votes) { this.votes = votes; }
    }

    // --- Getters & Setters cho CommunityPost ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getAuthorAvatar() { return authorAvatar; }
    public void setAuthorAvatar(String authorAvatar) { this.authorAvatar = authorAvatar; }
    public String getAuthorBadge() { return authorBadge; }
    public void setAuthorBadge(String badge) { this.authorBadge = badge; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }
    public int getComments() { return comments; }
    public void setComments(int comments) { this.comments = comments; }
    public PollData getPoll() { return poll; }
    public void setPoll(PollData poll) { this.poll = poll; }
    public List<String> getLikedUserIds() { return likedUserIds; }
    public void setLikedUserIds(List<String> likedUserIds) { this.likedUserIds = likedUserIds; }
}