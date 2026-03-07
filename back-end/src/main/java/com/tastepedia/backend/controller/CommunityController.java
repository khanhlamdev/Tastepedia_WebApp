package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.CommunityPost;
import com.tastepedia.backend.model.User; // Import model User
import com.tastepedia.backend.repository.CommunityPostRepository;
import com.tastepedia.backend.service.NotificationService;
import jakarta.servlet.http.HttpSession; // Import Session
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tastepedia.backend.model.Comment;
import com.tastepedia.backend.repository.CommentRepository;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;
import com.tastepedia.backend.service.CloudinaryService;
import java.io.IOException;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    @Autowired
    private CommunityPostRepository postRepository;

    @Autowired
    private com.tastepedia.backend.repository.UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file, 
            @RequestParam(value = "folder", defaultValue = "community/posts") String folder,
            HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        try {
            String url = cloudinaryService.uploadImage(file, folder);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    // 1. Lấy danh sách bài viết
    @GetMapping("/posts")
    public List<CommunityPost> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // 2. Tạo bài viết mới
    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody CommunityPost post, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để tương tác!");
        }

        // Validate số lượng ảnh (tối đa 10)
        if (post.getImages() != null && post.getImages().size() > 10) {
            return ResponseEntity.badRequest().body("Chỉ được upload tối đa 10 ảnh!");
        }

        post.setUserId(currentUser.getId());
        post.setAuthorName(currentUser.getFullName());
        
        // Sử dụng ảnh đại diện thật của User, nếu không có thì gán mặc định chuỗi rỗng
        post.setAuthorAvatar(currentUser.getProfileImageUrl() != null && !currentUser.getProfileImageUrl().isEmpty() ? currentUser.getProfileImageUrl() : "");
        
        // Xác định Badge dựa vào Role
        String badge = "Member";
        if ("CREATOR".equalsIgnoreCase(currentUser.getRole())) {
            badge = "Home Cook";
        } else if ("ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            badge = "Admin";
        }
        post.setAuthorBadge(badge);

        if (post.getPoll() != null) {
            post.getPoll().setTotalVotes(0);
        }

        CommunityPost savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }

    // --- SỬA BÀI VIẾT (EDIT POST) ---
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable String postId, @RequestBody CommunityPost updatedPost, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<CommunityPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            CommunityPost post = postOpt.get();
            // CHỈ cho phép chính chủ sửa bài
            if (!post.getUserId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Forbidden: You can only edit your own posts.");
            }
            
            // Cập nhật nội dung (Không cho sửa Poll hoặc loại bài)
            post.setContent(updatedPost.getContent());
            if (updatedPost.getImages() != null) {
                if (updatedPost.getImages().size() > 10) return ResponseEntity.badRequest().body("Max 10 images.");
                post.setImages(updatedPost.getImages());
            }
            if (updatedPost.getTags() != null) post.setTags(updatedPost.getTags());

            return ResponseEntity.ok(postRepository.save(post));
        }
        return ResponseEntity.notFound().build();
    }

    // --- XÓA BÀI VIẾT (DELETE POST) ---
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<CommunityPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            CommunityPost post = postOpt.get();
            // CHỈ User tạo bài HOẶC Admin mới được xóa
            if (!post.getUserId().equals(currentUser.getId()) && !"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
                return ResponseEntity.status(403).body("Forbidden: You cannot delete this post.");
            }

            postRepository.deleteById(postId);
            // Có thể thêm logic xóa luôn các comment thuộc về post này
            List<Comment> relatedComments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
            for (Comment c : relatedComments) {
                commentRepository.deleteById(c.getId());
            }

            return ResponseEntity.ok().body("Post deleted successfully.");
        }
        return ResponseEntity.notFound().build();
    }

    // --- LƯU BÀI VIẾT (SAVE POST) ---
    @PostMapping("/{postId}/save")
    public ResponseEntity<?> savePost(@PathVariable String postId, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<User> userOpt = userRepository.findById(currentUser.getId());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getSavedPosts() == null) user.setSavedPosts(new ArrayList<>());
            
            if (user.getSavedPosts().contains(postId)) {
                user.getSavedPosts().remove(postId); // Bỏ lưu
            } else {
                user.getSavedPosts().add(postId); // Lưu mới
            }
            userRepository.save(user);
            session.setAttribute("MY_SESSION_USER", user); // Cập nhật session
            return ResponseEntity.ok(Map.of("message", "Success", "savedPosts", user.getSavedPosts()));
        }
        return ResponseEntity.notFound().build();
    }

    // --- ẨN BÀI VIẾT (HIDE POST) ---
    @PostMapping("/{postId}/hide")
    public ResponseEntity<?> hidePost(@PathVariable String postId, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<User> userOpt = userRepository.findById(currentUser.getId());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getHiddenPosts() == null) user.setHiddenPosts(new ArrayList<>());
            
            if (!user.getHiddenPosts().contains(postId)) {
                user.getHiddenPosts().add(postId);
                userRepository.save(user);
                session.setAttribute("MY_SESSION_USER", user);
            }
            return ResponseEntity.ok(Map.of("message", "Post hidden successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    // --- REPORT BÀI VIẾT (REPORT POST) ---
    @PostMapping("/{postId}/report")
    public ResponseEntity<?> reportPost(@PathVariable String postId, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<CommunityPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            CommunityPost post = postOpt.get();
            post.setReportCount(post.getReportCount() + 1);
            postRepository.save(post);
            return ResponseEntity.ok(Map.of("message", "Post reported successfully", "reportCount", post.getReportCount()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable String postId, HttpSession session) {
        // --- CHECK LOGIN ---
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để tương tác!");
        }

        String userId = currentUser.getId(); // Lấy ID thật từ session

        Optional<CommunityPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            CommunityPost post = postOpt.get();
            if (post.getLikedUserIds() == null) post.setLikedUserIds(new ArrayList<>());

            if (post.getLikedUserIds().contains(userId)) {
                post.setLikes(post.getLikes() - 1);
                post.getLikedUserIds().remove(userId);
            } else {
                post.setLikes(post.getLikes() + 1);
                post.getLikedUserIds().add(userId);

                // --- NOTIFICATION: Chỉ gửi khi KHÔNG phải chính chủ like bài của mình ---
                if (!userId.equals(post.getUserId())) {
                    notificationService.createAndSend(
                        post.getUserId(),
                        "LIKE_POST",
                        currentUser.getFullName(),
                        currentUser.getProfileImageUrl() != null ? currentUser.getProfileImageUrl() : "",
                        currentUser.getFullName() + " đã thích bài viết của bạn.",
                        "/community"
                    );
                }
            }

            return ResponseEntity.ok(postRepository.save(post));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/comments/{commentId}/like")
    public ResponseEntity<?> likeComment(@PathVariable String commentId, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để tương tác!");
        }

        String userId = currentUser.getId();

        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            if (comment.getLikedUserIds() == null) comment.setLikedUserIds(new ArrayList<>());

            if (comment.getLikedUserIds().contains(userId)) {
                comment.setLikes(comment.getLikes() - 1);
                comment.getLikedUserIds().remove(userId);
            } else {
                comment.setLikes(comment.getLikes() + 1);
                comment.getLikedUserIds().add(userId);

                // --- NOTIFICATION: Chỉ gửi khi KHÔNG phải chính chủ like comment của mình ---
                if (!userId.equals(comment.getUserId())) {
                    notificationService.createAndSend(
                        comment.getUserId(),
                        "LIKE_COMMENT",
                        currentUser.getFullName(),
                        currentUser.getProfileImageUrl() != null ? currentUser.getProfileImageUrl() : "",
                        currentUser.getFullName() + " đã thích bình luận của bạn.",
                        "/community"
                    );
                }
            }

            return ResponseEntity.ok(commentRepository.save(comment));
        }
        return ResponseEntity.notFound().build();
    }

    @Autowired
    private CommentRepository commentRepository;

    // --- REPORT COMMENT (REPORT COMMENT) ---
    @PostMapping("/comments/{commentId}/report")
    public ResponseEntity<?> reportComment(@PathVariable String commentId, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            comment.setReportCount(comment.getReportCount() + 1);
            commentRepository.save(comment);
            return ResponseEntity.ok(Map.of("message", "Comment reported successfully", "reportCount", comment.getReportCount()));
        }
        return ResponseEntity.notFound().build();
    }

    // --- API VOTE POLL ---
    @PostMapping("/{postId}/vote")
    public ResponseEntity<?> votePoll(@PathVariable String postId, @RequestParam int optionId, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<CommunityPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            CommunityPost post = postOpt.get();
            if (post.getPoll() == null) return ResponseEntity.badRequest().body("Not a poll");

            Map<String, Integer> userVotes = post.getPoll().getUserVotes();
            if (userVotes == null) userVotes = new HashMap<>();

            // Nếu user đã vote rồi -> Update vote cũ
            if (userVotes.containsKey(currentUser.getId())) {
                int oldOptionId = userVotes.get(currentUser.getId());
                // Giảm vote cũ
                post.getPoll().getOptions().forEach(opt -> {
                    if (opt.getId() == oldOptionId) opt.setVotes(Math.max(0, opt.getVotes() - 1));
                });
                // Nếu optionId mới khác vote cũ thì total không đổi (chuyển đổi), nếu trùng thì coi như không làm gì (hoặc toggle unvote - ở đây ta giả sử là switch)
                // Logic hiện tại: switch vote
            } else {
                 // Vote mới hoàn toàn -> Tăng total
                post.getPoll().setTotalVotes(post.getPoll().getTotalVotes() + 1);
            }

            // Ghi nhận vote mới
            userVotes.put(currentUser.getId(), optionId);
            post.getPoll().setUserVotes(userVotes);

            // Tăng count cho option mới
            post.getPoll().getOptions().forEach(opt -> {
                if (opt.getId() == optionId) opt.setVotes(opt.getVotes() + 1);
            });

            return ResponseEntity.ok(postRepository.save(post));
        }
        return ResponseEntity.notFound().build();
    }

    // --- BẢNG XẾP HẠNG (LEADERBOARD) ---
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> leaderboard = new ArrayList<>();

        for (User user : allUsers) {
            int totalPoints = 0;
            String userId = user.getId();

            // Tính điểm từ Bài viết (10 điểm/bài + 1 điểm/like)
            List<CommunityPost> userPosts = postRepository.findAll().stream()
                .filter(p -> userId.equals(p.getUserId()))
                .toList();
            
            totalPoints += userPosts.size() * 10;
            for (CommunityPost p : userPosts) {
                totalPoints += p.getLikes();
            }

            // Tính điểm từ Bình luận (5 điểm/bình luận + 1 điểm/like)
            List<Comment> userComments = commentRepository.findAll().stream()
                .filter(c -> userId.equals(c.getUserId()))
                .toList();

            totalPoints += userComments.size() * 5;
            for (Comment c : userComments) {
                totalPoints += c.getLikes();
            }

            // Chỉ lấy người có điểm > 0
            if (totalPoints > 0) {
                Map<String, Object> userStats = new HashMap<>();
                userStats.put("id", userId);
                userStats.put("name", user.getFullName());
                
                String avatarUrl = user.getProfileImageUrl();
                userStats.put("avatarUrl", (avatarUrl != null && !avatarUrl.isEmpty()) ? avatarUrl : "");
                userStats.put("avatarText", user.getFullName().substring(0, 1).toUpperCase());
                
                userStats.put("points", totalPoints);

                String badge = "Member";
                String title = "Foodie";
                if ("CREATOR".equalsIgnoreCase(user.getRole())) {
                    badge = "👨‍🍳";
                    title = "Home Cook";
                } else if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                    badge = "👑";
                    title = "Admin";
                } else {
                    if (totalPoints > 100) { badge = "🔥"; title = "Rising Star"; }
                    if (totalPoints > 500) { badge = "🌟"; title = "Master Chef"; }
                }

                userStats.put("badge", badge);
                userStats.put("title", title);

                leaderboard.add(userStats);
            }
        }

        // Sắp xếp giảm dần theo điểm và lấy Top 5
        leaderboard.sort((a, b) -> (Integer) b.get("points") - (Integer) a.get("points"));
        return ResponseEntity.ok(leaderboard.size() > 5 ? leaderboard.subList(0, 5) : leaderboard);
    }

    // --- API LẤY COMMENT ---
    @GetMapping("/{postId}/comments")
    public List<Comment> getComments(@PathVariable String postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    // --- API ĐĂNG COMMENT / REPLY ---
    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable String postId,
            @RequestBody Map<String, Object> payload, // content, parentCommentId, images
            HttpSession session) {

        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        String content = (String) payload.get("content");
        String parentId = (String) payload.get("parentCommentId"); // ID comment cha nếu đây là reply
        @SuppressWarnings("unchecked")
        List<String> images = (List<String>) payload.get("images"); // Danh sách URL ảnh

        // Validate số lượng ảnh
        if (images != null && images.size() > 10) {
            return ResponseEntity.badRequest().body("Chỉ được upload tối đa 10 ảnh!");
        }

        if (parentId != null && !parentId.isEmpty()) {
            // Đây là Reply -> Tìm comment cha và add vào list replies
            Optional<Comment> parentOpt = commentRepository.findById(parentId);
            if (parentOpt.isPresent()) {
                Comment parent = parentOpt.get();
                Comment reply = new Comment();
                reply.setId(new org.bson.types.ObjectId().toString()); // Tự tạo ID
                reply.setPostId(postId);
                reply.setUserId(currentUser.getId());
                reply.setAuthorName(currentUser.getFullName());
                reply.setAuthorAvatar(currentUser.getProfileImageUrl() != null && !currentUser.getProfileImageUrl().isEmpty() ? currentUser.getProfileImageUrl() : "");
                reply.setContent(content);
                if (images != null) {
                    reply.setImages(images);
                }

                parent.getReplies().add(reply);
                commentRepository.save(parent); // Lưu comment cha (đã chứa reply)

                // Cập nhật số comment trong Post chính
                updatePostCommentCount(postId, 1);

                // --- NOTIFICATION: Notify chủ comment cha nếu KHÔNG phải chính mình reply ---
                if (!currentUser.getId().equals(parent.getUserId())) {
                    notificationService.createAndSend(
                        parent.getUserId(),
                        "REPLY_COMMENT",
                        currentUser.getFullName(),
                        currentUser.getProfileImageUrl() != null ? currentUser.getProfileImageUrl() : "",
                        currentUser.getFullName() + " đã trả lời bình luận của bạn.",
                        "/community"
                    );
                }

                return ResponseEntity.ok(parent);
            }
        } else {
            // Đây là Comment gốc
            Comment comment = new Comment();
            comment.setPostId(postId);
            comment.setUserId(currentUser.getId());
            comment.setAuthorName(currentUser.getFullName());
            comment.setAuthorAvatar(currentUser.getProfileImageUrl() != null && !currentUser.getProfileImageUrl().isEmpty() ? currentUser.getProfileImageUrl() : "");
            comment.setContent(content);
            if (images != null) {
                comment.setImages(images);
            }

            Comment saved = commentRepository.save(comment);
            updatePostCommentCount(postId, 1);

            // --- NOTIFICATION: Notify chủ bài viết nếu KHÔNG phải chính mình comment ---
            Optional<CommunityPost> postOpt2 = postRepository.findById(postId);
            postOpt2.ifPresent(targetPost -> {
                if (!currentUser.getId().equals(targetPost.getUserId())) {
                    notificationService.createAndSend(
                        targetPost.getUserId(),
                        "COMMENT_POST",
                        currentUser.getFullName(),
                        currentUser.getProfileImageUrl() != null ? currentUser.getProfileImageUrl() : "",
                        currentUser.getFullName() + " đã bình luận vào bài viết của bạn.",
                        "/community"
                    );
                }
            });

            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.badRequest().build();
    }

    // --- SỬA COMMENT (EDIT COMMENT) ---
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable String commentId, @RequestBody Map<String, Object> payload, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            if (!comment.getUserId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Forbidden: You can only edit your own comments.");
            }

            String content = (String) payload.get("content");
            @SuppressWarnings("unchecked")
            List<String> images = (List<String>) payload.get("images");

            if (content != null) comment.setContent(content);
            if (images != null) {
                if (images.size() > 10) return ResponseEntity.badRequest().body("Max 10 images.");
                comment.setImages(images);
            }

            return ResponseEntity.ok(commentRepository.save(comment));
        }
        // Thử tìm trong replies (nested comment) nếu không thấy ở top-level (Phức tạp hơn, tạm thời chỉ hỗ trợ edit top-level)
        return ResponseEntity.notFound().build();
    }

    // --- XÓA COMMENT (DELETE COMMENT) ---
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            if (!comment.getUserId().equals(currentUser.getId()) && !"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
                return ResponseEntity.status(403).body("Forbidden: You cannot delete this comment.");
            }

            String postId = comment.getPostId();
            commentRepository.deleteById(commentId);
            updatePostCommentCount(postId, -1);
            
            return ResponseEntity.ok().body("Comment deleted successfully.");
        }
        return ResponseEntity.notFound().build();
    }

    private void updatePostCommentCount(String postId, int delta) {
        Optional<CommunityPost> p = postRepository.findById(postId);
        p.ifPresent(post -> {
            post.setComments(post.getComments() + delta);
            postRepository.save(post);
        });
    }
}