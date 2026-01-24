package com.tastepedia.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tastepedia.backend.model.Recipe;
import com.tastepedia.backend.model.User;
import com.tastepedia.backend.repository.RecipeRepository;
import com.tastepedia.backend.service.CloudinaryService;
import com.tastepedia.backend.utils.StringUtils;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class RecipeController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private com.tastepedia.backend.service.RecipeSearchService recipeSearchService;

    // --- TÌM KIẾM & LỌC CÔNG THỨC ---
    @GetMapping("/search")
    public ResponseEntity<List<Recipe>> searchRecipes(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<String> cuisines,
            @RequestParam(required = false) List<String> dietaryTypes,
            @RequestParam(required = false) Integer cookTimeMax,
            @RequestParam(required = false) Integer caloriesMax,
            @RequestParam(required = false) Integer carbMax,
            @RequestParam(required = false) Integer fatMax,
            @RequestParam(required = false) Integer proteinMax,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        List<Recipe> results = recipeSearchService.searchRecipes(keyword, cuisines, dietaryTypes, cookTimeMax, caloriesMax, carbMax, fatMax, proteinMax, minPrice, maxPrice);
        return ResponseEntity.ok(results);
    }

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
            // Jackson sẽ tự map các trường JSON vào class Recipe (bao gồm cả nutrition)
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

            // --- BƯỚC 5.5: TẠO SHADOW FIELD CHO TÌM KIẾM ---
            if (recipe.getTitle() != null) {
                recipe.setSearchText(StringUtils.removeAccent(recipe.getTitle()).toLowerCase());
            }

            // --- BƯỚC 6: LƯU VÀO MONGODB ---
            Recipe savedRecipe = recipeRepository.save(recipe);

            return ResponseEntity.ok(savedRecipe);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi tạo công thức: " + e.getMessage());
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<List<Recipe>> getLatestRecipes() {
        List<Recipe> latestRecipes = recipeRepository.findTop6ByOrderByCreatedAtDesc();
        return ResponseEntity.ok(latestRecipes);
    }

    // --- API CHI TIẾT BÀI ĐĂNG ---
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable String id) {
        return recipeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- LẤY DANH SÁCH CÔNG THỨC CỦA USER HIỆN TẠI ---
    @GetMapping("/my-recipes")
    public ResponseEntity<?> getMyRecipes(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        List<Recipe> myRecipes = recipeRepository.findByAuthorIdOrderByCreatedAtDesc(currentUser.getId());
        return ResponseEntity.ok(myRecipes);
    }

    // --- XÓA CÔNG THỨC (CHỈ TÁC GIẢ MỚI XÓA ĐƯỢC) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable String id, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        Recipe recipe = recipeRepository.findById(id).orElse(null);
        if (recipe == null) {
            return ResponseEntity.status(404).body("Không tìm thấy công thức!");
        }

        // Kiểm tra quyền sở hữu
        if (!recipe.getAuthorId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("Bạn không có quyền xóa công thức này!");
        }

        recipeRepository.deleteById(id);
        return ResponseEntity.ok("Đã xóa công thức thành công!");
    }

    // --- CẬP NHẬT CÔNG THỨC (CHỈ TÁC GIẢ MỚI SỬA ĐƯỢC) ---
    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateRecipe(
            @PathVariable String id,
            @RequestPart("data") String recipeJson,
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "subImages", required = false) List<MultipartFile> subImages,
            HttpSession session
    ) {
        try {
            User currentUser = (User) session.getAttribute("MY_SESSION_USER");
            if (currentUser == null) {
                return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
            }

            Recipe existingRecipe = recipeRepository.findById(id).orElse(null);
            if (existingRecipe == null) {
                return ResponseEntity.status(404).body("Không tìm thấy công thức!");
            }

            // Kiểm tra quyền sở hữu
            if (!existingRecipe.getAuthorId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền sửa công thức này!");
            }

            // Parse JSON data
            ObjectMapper mapper = new ObjectMapper();
            Recipe updatedData = mapper.readValue(recipeJson, Recipe.class);

            // Giữ lại ID và thông tin tác giả
            updatedData.setId(id);
            updatedData.setAuthorId(existingRecipe.getAuthorId());
            updatedData.setAuthorName(existingRecipe.getAuthorName());
            updatedData.setCreatedAt(existingRecipe.getCreatedAt());

            // Upload ảnh mới nếu có
            if (mainImage != null && !mainImage.isEmpty()) {
                String mainUrl = cloudinaryService.uploadImage(mainImage);
                updatedData.setMainImageUrl(mainUrl);
            } else {
                updatedData.setMainImageUrl(existingRecipe.getMainImageUrl());
            }

            // Upload ảnh phụ mới nếu có
            if (subImages != null && !subImages.isEmpty()) {
                List<String> subUrls = new ArrayList<>();
                for (MultipartFile file : subImages) {
                    if (!file.isEmpty()) {
                        String url = cloudinaryService.uploadImage(file);
                        subUrls.add(url);
                    }
                }
                updatedData.setSubImageUrls(subUrls);
            } else {
                updatedData.setSubImageUrls(existingRecipe.getSubImageUrls());
            }

            // Cập nhật searchText
            if (updatedData.getTitle() != null) {
                updatedData.setSearchText(StringUtils.removeAccent(updatedData.getTitle()).toLowerCase());
            }

            Recipe savedRecipe = recipeRepository.save(updatedData);
            return ResponseEntity.ok(savedRecipe);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi cập nhật công thức: " + e.getMessage());
        }
    }
}