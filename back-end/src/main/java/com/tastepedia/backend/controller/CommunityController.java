package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.CommunityPost;
import com.tastepedia.backend.model.User; // Import model User
import com.tastepedia.backend.repository.CommunityPostRepository;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class CommunityController {

    @Autowired
    private CommunityPostRepository postRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

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
        //post.setAuthorAvatar(currentUser.getAvatar() != null ? currentUser.getAvatar() : "U");
        post.setAuthorAvatar("U");
        post.setAuthorBadge("Member");

        if (post.getPoll() != null) {
            post.getPoll().setTotalVotes(0);
        }

        CommunityPost savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
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
            }

            return ResponseEntity.ok(commentRepository.save(comment));
        }
        return ResponseEntity.notFound().build();
    }

    @Autowired
    private CommentRepository commentRepository;

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
                //reply.setAuthorAvatar(currentUser.getAvatar() != null ? currentUser.getAvatar() : "U");
                reply.setAuthorAvatar("U");
                reply.setContent(content);
                if (images != null) {
                    reply.setImages(images);
                }

                parent.getReplies().add(reply);
                commentRepository.save(parent); // Lưu comment cha (đã chứa reply)

                // Cập nhật số comment trong Post chính
                updatePostCommentCount(postId, 1);

                return ResponseEntity.ok(parent);
            }
        } else {
            // Đây là Comment gốc
            Comment comment = new Comment();
            comment.setPostId(postId);
            comment.setUserId(currentUser.getId());
            comment.setAuthorName(currentUser.getFullName());
            //comment.setAuthorAvatar(currentUser.getAvatar() != null ? currentUser.getAvatar() : "U");
            comment.setAuthorAvatar("U");
            comment.setContent(content);
            if (images != null) {
                comment.setImages(images);
            }

            Comment saved = commentRepository.save(comment);
            updatePostCommentCount(postId, 1);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.badRequest().build();
    }

    private void updatePostCommentCount(String postId, int delta) {
        Optional<CommunityPost> p = postRepository.findById(postId);
        p.ifPresent(post -> {
            post.setComments(post.getComments() + delta);
            postRepository.save(post);
        });
    }
}