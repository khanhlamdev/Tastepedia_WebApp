package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.Category;
import com.tastepedia.backend.model.Comment;
import com.tastepedia.backend.model.CommunityPost;
import com.tastepedia.backend.model.Recipe;
import com.tastepedia.backend.model.User;
import com.tastepedia.backend.repository.CategoryRepository;
import com.tastepedia.backend.repository.CommentRepository;
import com.tastepedia.backend.repository.CommunityPostRepository;
import com.tastepedia.backend.repository.RecipeRepository;
import com.tastepedia.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommunityPostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // --- HELPER: Kiểm tra quyền ADMIN ---
    private boolean isAdmin(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        return currentUser != null && "ADMIN".equalsIgnoreCase(currentUser.getRole());
    }

    // --- 1. ANALYTICS ---
    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden: Admins only.");

        List<User> allUsers = userRepository.findAll();
        List<CommunityPost> allPosts = postRepository.findAll();

        long totalUsers = allUsers.size();
        long totalPosts = allPosts.size();
        
        long pendingReports = allPosts.stream().filter(p -> p.getReportCount() > 0).count() +
                              commentRepository.findAll().stream().filter(c -> c.getReportCount() > 0).count();

        Map<String, Long> postsLast7Days = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long count = allPosts.stream()
                    .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().toLocalDate().isEqual(date))
                    .count();
            postsLast7Days.put(date.format(formatter), count);
        }

        Map<String, Long> usersLast7Days = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            usersLast7Days.put(date.format(formatter), (long) (Math.random() * 10)); 
        }

        // --- TREND ANALYSIS & ENGAGEMENT ---
        // Top 5 Bài Đăng sôi nổi nhất (Dựa trên tổng Likes + Comments)
        List<Map<String, Object>> topPosts = allPosts.stream()
                .sorted((p1, p2) -> Integer.compare(p2.getComments() + p2.getLikes(), p1.getComments() + p1.getLikes()))
                .limit(5)
                .map(p -> {
                    String title = p.getContent();
                    if (title == null) title = "Không có nội dung";
                    else if (title.length() > 40) title = title.substring(0, 40) + "...";
                    
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", p.getId());
                    map.put("title", title);
                    map.put("engagement", p.getComments() + p.getLikes());
                    map.put("author", p.getAuthorName() != null ? p.getAuthorName() : "Unknown");
                    return map;
                })
                .collect(Collectors.toList());

        // Top 5 Tags phổ biến nhất
        Map<String, Long> tagCounts = allPosts.stream()
                .filter(p -> p.getTags() != null)
                .flatMap(p -> p.getTags().stream())
                .collect(Collectors.groupingBy(tag -> tag, Collectors.counting()));
                
        List<Map<String, Object>> topTags = tagCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", e.getKey());
                    map.put("value", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("totalUsers", totalUsers);
        response.put("totalPosts", totalPosts);
        response.put("pendingReports", pendingReports);
        
        List<Map<String, Object>> chartData = new ArrayList<>();
        for (String dateStr : postsLast7Days.keySet()) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", dateStr);
            point.put("posts", postsLast7Days.get(dateStr));
            point.put("users", usersLast7Days.get(dateStr));
            chartData.add(point);
        }
        response.put("growthChart", chartData);
        response.put("topPosts", topPosts);
        response.put("topTags", topTags);

        return ResponseEntity.ok(response);
    }

    // --- 2. USER MANAGEMENT ---
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        List<User> users = userRepository.findAll();
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String userId, @RequestBody Map<String, String> body, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        
        String newRole = body.get("role");
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setRole(newRole.toUpperCase());
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Role updated", "user", user));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/users/{userId}/verify")
    public ResponseEntity<?> verifyCreator(@PathVariable String userId, @RequestBody Map<String, Boolean> body, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        
        boolean isVerified = body.getOrDefault("verified", true);
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setVerified(isVerified); 
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Creator verification updated"));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId, HttpSession session) {
         if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
         
         if (userRepository.existsById(userId)) {
             userRepository.deleteById(userId);
             return ResponseEntity.ok(Map.of("message", "User deleted permanently."));
         }
         return ResponseEntity.notFound().build();
    }

    // --- 3. MODERATION CENTER ---
    @GetMapping("/reports")
    public ResponseEntity<?> getReportedContent(HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");

        List<CommunityPost> reportedPosts = postRepository.findAll().stream()
                .filter(p -> p.getReportCount() > 0)
                .sorted((p1, p2) -> Integer.compare(p2.getReportCount(), p1.getReportCount()))
                .collect(Collectors.toList());

        List<Comment> reportedComments = commentRepository.findAll().stream()
                .filter(c -> c.getReportCount() > 0)
                .sorted((c1, c2) -> Integer.compare(c2.getReportCount(), c1.getReportCount()))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("reportedPosts", reportedPosts);
        response.put("reportedComments", reportedComments);

        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/reports/posts/{postId}")
    public ResponseEntity<?> deleteReportedPost(@PathVariable String postId, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        
        if (postRepository.existsById(postId)) {
            postRepository.deleteById(postId);
            List<Comment> relatedComments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
            for (Comment c : relatedComments) {
                commentRepository.deleteById(c.getId());
            }
            return ResponseEntity.ok(Map.of("message", "Reported post deleted."));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/reports/comments/{commentId}")
    public ResponseEntity<?> deleteReportedComment(@PathVariable String commentId, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        
        if (commentRepository.existsById(commentId)) {
            commentRepository.deleteById(commentId);
             return ResponseEntity.ok(Map.of("message", "Reported comment deleted."));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/reports/posts/{postId}/dismiss")
    public ResponseEntity<?> dismissPostReport(@PathVariable String postId, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        Optional<CommunityPost> p = postRepository.findById(postId);
        if(p.isPresent()){
            CommunityPost post = p.get();
            post.setReportCount(0);
            postRepository.save(post);
            return ResponseEntity.ok(Map.of("message", "Report dismissed."));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/reports/comments/{commentId}/dismiss")
    public ResponseEntity<?> dismissCommentReport(@PathVariable String commentId, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        Optional<Comment> c = commentRepository.findById(commentId);
        if(c.isPresent()){
            Comment comment = c.get();
            comment.setReportCount(0);
            commentRepository.save(comment);
            return ResponseEntity.ok(Map.of("message", "Report dismissed."));
        }
        return ResponseEntity.notFound().build();
    }

    // --- 4. RECIPE CATALOG & CATEGORIES ---
    @GetMapping("/recipes")
    public ResponseEntity<?> getAllRecipes(HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        return ResponseEntity.ok(recipeRepository.findAll());
    }

    @PutMapping("/recipes/{recipeId}/approve")
    public ResponseEntity<?> toggleRecipeApproval(@PathVariable String recipeId, @RequestBody Map<String, Boolean> body, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        boolean isApproved = body.getOrDefault("isApproved", true);
        
        Optional<Recipe> recipeOpt = recipeRepository.findById(recipeId);
        if (recipeOpt.isPresent()) {
            Recipe recipe = recipeOpt.get();
            recipe.setApproved(isApproved);
            recipeRepository.save(recipe);
            return ResponseEntity.ok(Map.of("message", "Recipe approval status updated"));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/recipes/{recipeId}")
    public ResponseEntity<?> deleteRecipe(@PathVariable String recipeId, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        if (recipeRepository.existsById(recipeId)) {
            recipeRepository.deleteById(recipeId);
            return ResponseEntity.ok(Map.of("message", "Recipe deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    // CATEGORIES
    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories(HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody Category category, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable String categoryId, HttpSession session) {
        if (!isAdmin(session)) return ResponseEntity.status(403).body("Forbidden");
        if (categoryRepository.existsById(categoryId)) {
            categoryRepository.deleteById(categoryId);
            return ResponseEntity.ok(Map.of("message", "Category deleted"));
        }
        return ResponseEntity.notFound().build();
    }
}
