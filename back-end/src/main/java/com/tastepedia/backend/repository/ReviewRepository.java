package com.tastepedia.backend.repository;

import com.tastepedia.backend.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    // Tìm tất cả review của một món ăn cụ thể, sắp xếp mới nhất trước
    List<Review> findByRecipeIdOrderByCreatedAtDesc(String recipeId);
}