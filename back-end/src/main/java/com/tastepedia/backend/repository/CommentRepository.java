package com.tastepedia.backend.repository;
import com.tastepedia.backend.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    // Lấy comment gốc (không phải reply) của bài viết
    List<Comment> findByPostIdOrderByCreatedAtDesc(String postId);
}