package com.tastepedia.backend.repository;

import com.tastepedia.backend.model.CommunityPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommunityPostRepository extends MongoRepository<CommunityPost, String> {
    // Lấy tất cả bài viết, sắp xếp mới nhất lên đầu
    List<CommunityPost> findAllByOrderByCreatedAtDesc();
}