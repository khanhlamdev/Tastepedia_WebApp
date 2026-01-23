package com.tastepedia.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tastepedia.backend.model.Recipe;
import com.tastepedia.backend.model.User; // Import model User của bạn
import com.tastepedia.backend.repository.RecipeRepository;
import com.tastepedia.backend.service.CloudinaryService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")public class RecipeController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private RecipeRepository recipeRepository;

    @PostMapping(value = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createRecipe(
            // 1. Nhận chuỗi JSON chứa thông tin bài viết (title, ingredients...)
            @RequestPart("data") String recipeJson,

            // 2. Nhận file ảnh chính (có thể null nếu user ko up)
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,

            // 3. Nhận danh sách ảnh phụ (tối đa 3 cái từ frontend)
            @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages,

            // 4. Nhận Session để biết ai đang đăng bài
            HttpSession session
    ) {
        try {
            // --- BƯỚC 1: CHECK LOGIN ---
            User currentUser = (User) session.getAttribute("MY_SESSION_USER");
            if (currentUser == null) {
                return ResponseEntity.status(401).body("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
            }

            // --- BƯỚC 2: CONVERT JSON STRING -> OBJECT JAVA ---
            ObjectMapper mapper = new ObjectMapper();
            // Jackson sẽ tự map các trường JSON vào class Recipe
            Recipe recipe = mapper.readValue(recipeJson, Recipe.class);

            // --- BƯỚC 3: UPLOAD ẢNH CHÍNH (Nếu có) ---
            if (mainImage != null && !mainImage.isEmpty()) {
                String mainUrl = cloudinaryService.uploadImage(mainImage);
                recipe.setMainImageUrl(mainUrl);
            }

            // --- BƯỚC 4: UPLOAD ẢNH PHỤ (Nếu có) ---
            List<String> subUrls = new ArrayList<>();
            if (subImages != null && !subImages.isEmpty()) {
                for (MultipartFile file : subImages) {
                    if (!file.isEmpty()) {
                        String url = cloudinaryService.uploadImage(file);
                        subUrls.add(url);
                    }
                }
            }
            recipe.setSubImageUrls(subUrls);

            // --- BƯỚC 5: GÁN TÁC GIẢ ---
            recipe.setAuthorId(currentUser.getId());
            recipe.setAuthorName(currentUser.getFullName());

            // --- BƯỚC 6: LƯU VÀO MONGODB ---
            Recipe savedRecipe = recipeRepository.save(recipe);

            return ResponseEntity.ok(savedRecipe);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi tạo công thức: " + e.getMessage());
        }
    }
}