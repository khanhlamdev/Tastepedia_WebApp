package com.tastepedia.backend.repository;

import com.tastepedia.backend.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {
}
