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

    // --- API GỢI Ý DỰA TRÊN SỞ THÍCH USER (ONBOARDING) ---
    @GetMapping("/recommended")
    public ResponseEntity<List<Recipe>> getRecommendedRecipes(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        
        // Nếu chưa login hoặc chưa có preferences, trả về random
        if (currentUser == null || currentUser.getPreferences() == null) {
            List<Recipe> randomRecipes = recipeRepository.findTop6ByOrderByCreatedAtDesc();
            return ResponseEntity.ok(randomRecipes);
        }

        java.util.Map<String, Object> prefs = currentUser.getPreferences();
        
        // Lấy tất cả recipes
        List<Recipe> allRecipes = recipeRepository.findAll();
        List<Recipe> recommended = new ArrayList<>();

        for (Recipe recipe : allRecipes) {
            boolean matches = true;

            // 1. Filter by Diet
            if (prefs.get("diet") != null) {
                String userDiet = prefs.get("diet").toString().toLowerCase();
                List<String> recipeDiets = recipe.getDietaryType();
                
                // Mapping logic - check if recipe's dietary types match user's preference
                if (recipeDiets != null && !recipeDiets.isEmpty()) {
                    boolean dietMatches = false;
                    
                    for (String recipeDiet : recipeDiets) {
                        String recipeDietLower = recipeDiet.toLowerCase();
                        
                        if ("vegetarian".equals(userDiet)) {
                            if (recipeDietLower.contains("vegetarian") || recipeDietLower.contains("vegan")) {
                                dietMatches = true;
                                break;
                            }
                        } else if ("vegan".equals(userDiet)) {
                            if (recipeDietLower.contains("vegan")) {
                                dietMatches = true;
                                break;
                            }
                        } else if ("keto".equals(userDiet)) {
                            if (recipeDietLower.contains("keto") || recipeDietLower.contains("low-carb")) {
                                dietMatches = true;
                                break;
                            }
                        } else {
                            // For omnivore or other diets, accept all
                            dietMatches = true;
                            break;
                        }
                    }
                    
                    if (!dietMatches && !"omnivore".equals(userDiet)) {
                        matches = false;
                    }
                }
            }

            // 2. Filter by Allergies
            if (prefs.get("allergies") != null) {
                @SuppressWarnings("unchecked")
                List<String> userAllergies = (List<String>) prefs.get("allergies");
                List<String> recipeAllergens = recipe.getAllergens();
                
                if (recipeAllergens != null) {
                    for (String allergy : userAllergies) {
                        if (recipeAllergens.stream().anyMatch(a -> 
                            a.toLowerCase().contains(allergy.toLowerCase()))) {
                            matches = false;
                            break;
                        }
                    }
                }
            }

            // 3. Prioritize by Cuisine (but don't exclude)
            // We'll sort by matching cuisine later instead of filtering here

            if (matches) {
                recommended.add(recipe);
            }
        }

        // Sort by cuisine match (preferred cuisines first)
        if (prefs.get("cuisines") != null) {
            @SuppressWarnings("unchecked")
            List<String> userCuisines = (List<String>) prefs.get("cuisines");
            recommended.sort((r1, r2) -> {
                boolean r1Match = userCuisines.stream().anyMatch(cuisineCode -> 
                    matchesCuisine(r1.getCuisine(), cuisineCode));
                boolean r2Match = userCuisines.stream().anyMatch(cuisineCode -> 
                    matchesCuisine(r2.getCuisine(), cuisineCode));
                
                if (r1Match && !r2Match) return -1;
                if (!r1Match && r2Match) return 1;
                return 0;
            });
        }

        // Return top 6
        return ResponseEntity.ok(recommended.stream().limit(6).toList());
    }

    // Helper method to map cuisine codes to full names
    private boolean matchesCuisine(String recipeCuisine, String cuisineCode) {
        if (recipeCuisine == null || cuisineCode == null) return false;
        
        String cuisineLower = recipeCuisine.toLowerCase();
        String code = cuisineCode.toLowerCase();
        
        // Mapping from onboarding codes to recipe cuisine names
        return switch (code) {
            case "vn" -> cuisineLower.contains("viet") || cuisineLower.contains("vietnam");
            case "it" -> cuisineLower.contains("ital");
            case "jp" -> cuisineLower.contains("japan");
            case "kr" -> cuisineLower.contains("korea");
            case "cn" -> cuisineLower.contains("chin");
            case "in" -> cuisineLower.contains("india");
            case "th" -> cuisineLower.contains("thai");
            case "mx" -> cuisineLower.contains("mexican");
            case "fr" -> cuisineLower.contains("french");
            case "us" -> cuisineLower.contains("american");
            default -> false;
        };
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
            Recipe updatedRecipe = mapper.readValue(recipeJson, Recipe.class);

            // Update basic info
            existingRecipe.setTitle(updatedRecipe.getTitle());
            existingRecipe.setDescription(updatedRecipe.getDescription());
            existingRecipe.setCookTime(updatedRecipe.getCookTime());
            existingRecipe.setPrepTime(updatedRecipe.getPrepTime()); // NEW
            existingRecipe.setServings(updatedRecipe.getServings());
            existingRecipe.setDifficulty(updatedRecipe.getDifficulty());
            
            // Update Classification
            existingRecipe.setDietaryType(updatedRecipe.getDietaryType());
            existingRecipe.setMealCourse(updatedRecipe.getMealCourse()); // NEW
            existingRecipe.setCuisine(updatedRecipe.getCuisine());
            
            // Update AI/Meta fields
            existingRecipe.setKitchenTools(updatedRecipe.getKitchenTools()); // NEW
            existingRecipe.setAllergens(updatedRecipe.getAllergens());       // NEW
            existingRecipe.setStorageInstruction(updatedRecipe.getStorageInstruction()); // NEW
            existingRecipe.setChefTips(updatedRecipe.getChefTips());         // NEW
            
            // Update Video
            existingRecipe.setVideoUrl(updatedRecipe.getVideoUrl());         // NEW
            existingRecipe.setVideoType(updatedRecipe.getVideoType());       // NEW

            // Update Complex Objects
            existingRecipe.setIngredients(updatedRecipe.getIngredients());
            existingRecipe.setSteps(updatedRecipe.getSteps());
            existingRecipe.setNutrition(updatedRecipe.getNutrition());
            existingRecipe.setTotalCost(updatedRecipe.getTotalCost());

            // Upload ảnh mới nếu có
            if (mainImage != null && !mainImage.isEmpty()) {
                String mainUrl = cloudinaryService.uploadImage(mainImage);
                existingRecipe.setMainImageUrl(mainUrl);
            } else if (updatedRecipe.getMainImageUrl() != null) { // If main image was removed from frontend
                existingRecipe.setMainImageUrl(updatedRecipe.getMainImageUrl());
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
                existingRecipe.setSubImageUrls(subUrls);
            } else {
                existingRecipe.setSubImageUrls(existingRecipe.getSubImageUrls());
            }

            // Cập nhật searchText
            if (existingRecipe.getTitle() != null) {
                existingRecipe.setSearchText(StringUtils.removeAccent(existingRecipe.getTitle()).toLowerCase());
            }

            Recipe savedRecipe = recipeRepository.save(existingRecipe);
            return ResponseEntity.ok(savedRecipe);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi cập nhật công thức: " + e.getMessage());
        }
    }
}