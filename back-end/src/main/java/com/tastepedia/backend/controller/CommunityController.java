package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.CommunityPost;
import com.tastepedia.backend.repository.CommunityPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CommunityController {

    @Autowired
    private CommunityPostRepository postRepository;

    // 1. Lấy danh sách bài viết
    @GetMapping("/posts")
    public List<CommunityPost> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // 2. Tạo bài viết mới
    @PostMapping("/create")
    public CommunityPost createPost(@RequestBody CommunityPost post) {
        // Xử lý thêm nếu là Poll (tính tổng votes ban đầu = 0)
        if (post.getPoll() != null) {
            post.getPoll().setTotalVotes(0);
        }
        return postRepository.save(post);
    }

    @PutMapping("/{postId}/like")
    public ResponseEntity<CommunityPost> likePost(@PathVariable String postId, @RequestBody String userId) {
        // Lưu ý: userId gửi lên dạng raw string, nên có thể dính dấu ngoặc kép nếu gửi JSON.
        // Để đơn giản, ta sẽ clean chuỗi userId.
        String cleanUserId = userId.replaceAll("\"", "");

        Optional<CommunityPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            CommunityPost post = postOpt.get();

            // Kiểm tra xem user đã like chưa
            if (post.getLikedUserIds().contains(cleanUserId)) {
                // Nếu like rồi -> Unlike (giảm like, xóa ID)
                post.setLikes(post.getLikes() - 1);
                post.getLikedUserIds().remove(cleanUserId);
            } else {
                // Chưa like -> Like (tăng like, thêm ID)
                post.setLikes(post.getLikes() + 1);
                post.getLikedUserIds().add(cleanUserId);
            }

            CommunityPost updatedPost = postRepository.save(post);
            return ResponseEntity.ok(updatedPost);
        }
        return ResponseEntity.notFound().build();
    }
}