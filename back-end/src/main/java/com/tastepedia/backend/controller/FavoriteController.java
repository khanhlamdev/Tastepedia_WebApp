package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.Recipe;
import com.tastepedia.backend.model.User;
import com.tastepedia.backend.repository.RecipeRepository;
import com.tastepedia.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class FavoriteController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    // Thêm công thức vào danh sách yêu thích
    @PostMapping("/{recipeId}")
    public ResponseEntity<?> addFavorite(@PathVariable String recipeId, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        // Lấy user từ DB để có data mới nhất
        User user = userRepository.findById(currentUser.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy user!");
        }

        // Kiểm tra xem đã yêu thích chưa
        if (user.getFavoriteRecipeIds().contains(recipeId)) {
            return ResponseEntity.badRequest().body("Đã có trong danh sách yêu thích!");
        }

        // Thêm vào danh sách
        user.getFavoriteRecipeIds().add(recipeId);
        userRepository.save(user);

        // Cập nhật session
        session.setAttribute("MY_SESSION_USER", user);

        return ResponseEntity.ok("Đã thêm vào yêu thích!");
    }

    // Xóa công thức khỏi danh sách yêu thích
    @DeleteMapping("/{recipeId}")
    public ResponseEntity<?> removeFavorite(@PathVariable String recipeId, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        User user = userRepository.findById(currentUser.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy user!");
        }

        // Xóa khỏi danh sách
        user.getFavoriteRecipeIds().remove(recipeId);
        userRepository.save(user);

        // Cập nhật session
        session.setAttribute("MY_SESSION_USER", user);

        return ResponseEntity.ok("Đã xóa khỏi yêu thích!");
    }

    // Lấy danh sách công thức yêu thích
    @GetMapping
    public ResponseEntity<?> getFavorites(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        User user = userRepository.findById(currentUser.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy user!");
        }

        // Lấy danh sách recipes từ IDs
        List<Recipe> favoriteRecipes = new ArrayList<>();
        for (String recipeId : user.getFavoriteRecipeIds()) {
            recipeRepository.findById(recipeId).ifPresent(favoriteRecipes::add);
        }

        return ResponseEntity.ok(favoriteRecipes);
    }

    // Kiểm tra xem recipe có trong favorites không
    @GetMapping("/check/{recipeId}")
    public ResponseEntity<?> checkFavorite(@PathVariable String recipeId, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) {
            return ResponseEntity.ok(false);
        }

        User user = userRepository.findById(currentUser.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(false);
        }

        boolean isFavorite = user.getFavoriteRecipeIds().contains(recipeId);
        return ResponseEntity.ok(isFavorite);
    }
}
