package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.Recipe;
import com.tastepedia.backend.payload.MealPlanRequest;
import com.tastepedia.backend.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class AIController {

    @Autowired
    private com.tastepedia.backend.service.GeminiService geminiService;

    @Autowired
    private RecipeRepository recipeRepository;

    @PostMapping("/meal-plan")
    public ResponseEntity<?> generateMealPlan(@RequestBody MealPlanRequest request) {
        // 1. Fetch available recipes
        List<Recipe> allRecipes = recipeRepository.findAll();

        // 2. LAYER 1: HARD FILTER (Backend)
        // 2. LAYER 1: HARD FILTER (Backend)
        // A. Base Safety Filter (Always applied)
        List<Recipe> baseSafeRecipes = allRecipes.stream()
                .filter(r -> isSafeToEat(r, request.getAllergies()))
                .filter(r -> !containsDislikedIngredients(r, request.getDislikedIngredients()))
                .collect(Collectors.toList());

        // B. Apply Preference Filters (Tools & Cuisine)
        List<Recipe> strictFiltered = baseSafeRecipes.stream()
                .filter(r -> hasRequiredTools(r, request.getKitchenTools()))
                .filter(r -> matchesCuisine(r, request.getPreferredCuisine()))
                .collect(Collectors.toList());

        List<Recipe> finalSafeRecipes;

        // --- RESCUE STRATEGY: If strict filters leave too few recipes (< 5), RELAX constraints ---
        if (strictFiltered.size() < 5) {
            System.out.println("Warning: Strict filter found only " + strictFiltered.size() + " recipes. Relaxing Cuisine...");
            
            // Relax 1: Keep Tools, Ignore Cuisine
            List<Recipe> relaxedCuisine = baseSafeRecipes.stream()
                .filter(r -> hasRequiredTools(r, request.getKitchenTools()))
                .collect(Collectors.toList());
                
            if (relaxedCuisine.size() < 5) {
                System.out.println("Warning: Still low (" + relaxedCuisine.size() + "). Relaxing Tools...");
                // Relax 2: Return all Base Safe Recipes (Ignore Tools & Cuisine)
                finalSafeRecipes = baseSafeRecipes;
            } else {
                finalSafeRecipes = relaxedCuisine;
            }
        } else {
            finalSafeRecipes = strictFiltered;
        }

        System.out.println("Recipes after Filter (Strict/Relaxed): " + finalSafeRecipes.size());

        // 3. LAYER 2: BUFFET POOL (Randomize & Limit)
        List<Recipe> buffetPool = createBuffetPool(finalSafeRecipes, request.getMealSchedule());
        
        System.out.println("Final Buffet Pool Size: " + buffetPool.size());
        System.out.println("--- BUFFET POOL CONTENT ---");
        buffetPool.forEach(r -> System.out.println("- " + r.getTitle() + " (" + r.getId() + ")"));
        System.out.println("---------------------------");

        // 4. Call AI with the pool
        String planJson = geminiService.generateMealPlan(request, buffetPool);

        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(planJson);
    }

    // --- HELPER METHODS ---

    private boolean isSafeToEat(Recipe recipe, List<String> userAllergies) {
        if (userAllergies == null || userAllergies.isEmpty()) return true;
        // Check ingredients
        if (recipe.getIngredients() != null) {
            for (Recipe.Ingredient ing : recipe.getIngredients()) {
                String ingName = ing.getName().toLowerCase();
                for (String allergy : userAllergies) {
                     if (ingName.contains(allergy.toLowerCase())) { return false; }
                }
            }
        }
        // Check allergens metadata
        if (recipe.getAllergens() != null) {
             if (recipe.getAllergens().stream().anyMatch(a -> 
                 userAllergies.stream().anyMatch(ua -> ua.equalsIgnoreCase(a)))) return false;
        }
        return true;
    }

    private boolean containsDislikedIngredients(Recipe recipe, String dislikes) {
        if (dislikes == null || dislikes.trim().isEmpty()) return false;
        String[] dislikedItems = dislikes.toLowerCase().split(",");
        if (recipe.getIngredients() != null) {
            for (Recipe.Ingredient ing : recipe.getIngredients()) {
                String ingName = ing.getName().toLowerCase();
                for (String dislike : dislikedItems) {
                    if (ingName.contains(dislike.trim())) { return true; }
                }
            }
        }
        return false;
    }

    private boolean hasRequiredTools(Recipe recipe, List<String> userTools) {
        if (recipe.getKitchenTools() == null || recipe.getKitchenTools().isEmpty()) return true;
        if (userTools == null || userTools.isEmpty()) return false;

        // Normalize User Tools to a standard set (Lower English)
        List<String> userToolsStd = userTools.stream()
            .map(this::normalizeToolName)
            .collect(Collectors.toList());
        
        for (String required : recipe.getKitchenTools()) {
            String reqStd = normalizeToolName(required);
            
            // Check if user has this tool
            // We use simple containment
            boolean hasTool = userToolsStd.stream().anyMatch(ut -> ut.contains(reqStd) || reqStd.contains(ut));
            
            if (!hasTool) return false; 
        }
        return true;
    }

    // Helper to map Vietnamese/Variations to standard English keys
    private String normalizeToolName(String input) {
        if (input == null) return "";
        String s = input.toLowerCase().trim();
        
        if (s.contains("lò nướng") || s.contains("oven")) return "oven";
        if (s.contains("vi sóng") || s.contains("microwave")) return "microwave";
        if (s.contains("nồi cơm") || s.contains("rice cooker")) return "rice cooker";
        if (s.contains("nồi chiên") || s.contains("air fryer")) return "air fryer";
        if (s.contains("máy xay") || s.contains("blender")) return "blender";
        if (s.contains("bếp") || s.contains("stove")) return "stove";
        if (s.contains("chảo") || s.contains("pan")) return "pan"; // "Stove" often implies pan, but handled loosely
        
        return s;
    }

    private boolean matchesCuisine(Recipe recipe, String preferredCuisine) {
        if (preferredCuisine == null || preferredCuisine.equals("All")) return true;
        if (recipe.getCuisine() == null) return false;
        
        if (preferredCuisine.equals("Asian")) {
            // Group Asian cuisines
            return List.of("Vietnamese", "Korean", "Japanese", "Thai", "Chinese")
                   .contains(recipe.getCuisine());
        }
        
        return recipe.getCuisine().equalsIgnoreCase(preferredCuisine);
    }

    private List<Recipe> createBuffetPool(List<Recipe> safeRecipes, List<String> mealSchedule) {
        boolean includeBreakfast = mealSchedule != null && mealSchedule.contains("Breakfast");
        
        // Split into groups
        List<Recipe> breakfastRecipes = safeRecipes.stream()
            .filter(r -> r.getMealCourse() != null && r.getMealCourse().contains("Breakfast"))
            .collect(Collectors.toList());
            
        List<Recipe> mainRecipes = safeRecipes.stream()
            .filter(r -> r.getMealCourse() != null && (r.getMealCourse().contains("Lunch") || r.getMealCourse().contains("Dinner")))
            .collect(Collectors.toList());

        // Shuffle
        java.util.Collections.shuffle(breakfastRecipes);
        java.util.Collections.shuffle(mainRecipes);

        // Limit strategy: 
        // If Breakfast is required -> take 10 breakfast + 20 main
        // If no Breakfast -> take 30 main
        
        List<Recipe> finalPool = new java.util.ArrayList<>();
        
        int breakfastLimit = includeBreakfast ? 10 : 0;
        int mainLimit = includeBreakfast ? 20 : 30;

        finalPool.addAll(breakfastRecipes.stream().limit(breakfastLimit).collect(Collectors.toList()));
        finalPool.addAll(mainRecipes.stream().limit(mainLimit).collect(Collectors.toList()));
        
        // If we don't have enough, fill with whatever is left from safeRecipes (unique)
        if (finalPool.size() < 20) {
             safeRecipes.stream()
                 .filter(r -> !finalPool.contains(r))
                 .limit(30 - finalPool.size())
                 .forEach(finalPool::add);
        }

        return finalPool;
    }
}
