package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.Review;
import com.tastepedia.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    // 1. Lấy danh sách review theo ID món ăn
    @GetMapping("/{recipeId}")
    public List<Review> getReviewsByRecipe(@PathVariable String recipeId) {
        return reviewRepository.findByRecipeIdOrderByCreatedAtDesc(recipeId);
    }

    // 2. Đăng review mới
    @PostMapping("/add")
    public Review addReview(@RequestBody Review review) {
        // Trong thực tế, bạn sẽ lấy userId từ Token đăng nhập
        // Ở đây tạm thời nhận trực tiếp từ Body để test
        return reviewRepository.save(review);
    }
}