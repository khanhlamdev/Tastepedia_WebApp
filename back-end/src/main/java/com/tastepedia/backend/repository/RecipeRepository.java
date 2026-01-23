package com.tastepedia.backend.repository;

import com.tastepedia.backend.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecipeRepository extends MongoRepository<Recipe, String> {
    // Có thể thêm: List<Recipe> findByAuthorId(String authorId);
}