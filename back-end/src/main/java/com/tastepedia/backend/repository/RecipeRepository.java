package com.tastepedia.backend.repository;

import com.tastepedia.backend.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RecipeRepository extends MongoRepository<Recipe, String> {
    // Tìm 6 bài mới nhất (sắp xếp giảm dần theo createdAt)
    List<Recipe> findTop6ByOrderByCreatedAtDesc();
    
    // Tìm tất cả công thức của một tác giả, sắp xếp theo ngày tạo mới nhất
    List<Recipe> findByAuthorIdOrderByCreatedAtDesc(String authorId);
}