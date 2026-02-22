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
    
    // Shadow field cho tìm kiếm không dấu
    private String searchText; // "banh mi thit nuong"

    private String description;
    private int cookTime; // Thời gian nấu (phút)
    private int prepTime; // Thời gian chuẩn bị (phút)

    private int servings; // Khẩu phần
    private String difficulty; // Dễ, Vừa, Khó

    // URL ảnh từ Cloudinary
    private String mainImageUrl;
    private List<String> subImageUrls;
    
    // Video
    private String videoUrl; // Link Youtube hoặc Cloudinary
    private String videoType; // "YOUTUBE" hoặc "UPLOAD"

    // --- PHÂN LOẠI MÓN ĂN & QUỐC GIA ---
    private List<String> dietaryType; // Ví dụ: ["Mặn", "Healthy"]
    private List<String> mealCourse; // Sáng, Trưa, Tối, Snack...
    private String cuisine;           // Ví dụ: "Việt Nam"

    // --- METADATA CHO AI ---
    private List<String> kitchenTools; // Nồi chiên, Lò nướng...
    private List<String> allergens;    // Đậu phộng, Hải sản...
    
    // --- TEXT FIELDS MỚI ---
    private String storageInstruction; // Hướng dẫn bảo quản
    private String chefTips;           // Mẹo đầu bếp

    // Các class con
    private List<Ingredient> ingredients;
    private List<Step> steps;

    // --- FIELD DINH DƯỠNG MỚI ---
    private Nutrition nutrition;

    // Thông tin người đăng (Lấy từ Session)
    private String authorId;
    private String authorName;

    // Thông tin tài chính
    private Double totalCost;
    private Double estimatedCommission;

    // Cài đặt bài đăng (Jackson sẽ tự động map "premium" -> "isPremium")
    private boolean isPremium;
    private String visibility; // "public", "private", "subscribers"
    private boolean isApproved = true; // Admin duyệt. Mặc định true cho demo, hệ thống thực tế có thể set false.

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

    @Data
    public static class Nutrition {
        private int calories;
        private int carb;
        private int protein;
        private int fat;
    }
}