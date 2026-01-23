package com.tastepedia.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "recipes")
public class Recipe {
    @Id
    private String id;

    private String title;
    private String description;
    private int cookTime; // Phút
    private int servings; // Khẩu phần
    private String difficulty; // Dễ, Vừa, Khó

    // URL ảnh từ Cloudinary
    private String mainImageUrl;
    private List<String> subImageUrls;

    // Các class con (bên dưới)
    private List<Ingredient> ingredients;
    private List<Step> steps;

    // Thông tin người đăng (Lấy từ Session)
    private String authorId;
    private String authorName;

    // Thông tin tài chính
    private Double totalCost;
    private Double estimatedCommission;
    
    // Cài đặt bài đăng
    private boolean isPremium;
    private String visibility; // "public", "private", "subscribers"

    private Date createdAt = new Date();

    // --- INNER CLASSES ---
    @Data
    public static class Ingredient {
        private String name;
        private String quantity;
        private String unit;
        private Double price;
    }

    @Data
    public static class Step {
        private int stepNumber;
        private String content;
    }
}