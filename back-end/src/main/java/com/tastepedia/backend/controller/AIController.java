package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.Recipe;
import com.tastepedia.backend.payload.MealPlanRequest;
import com.tastepedia.backend.repository.RecipeRepository;
import com.tastepedia.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class AIController {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private RecipeRepository recipeRepository;

    @PostMapping("/meal-plan")
    public ResponseEntity<?> generateMealPlan(@RequestBody MealPlanRequest request) {
        // 1. Fetch available recipes (In real app, maybe filter by inventory or seasonality)
        List<Recipe> allRecipes = recipeRepository.findAll();

        // 2. Call AI
        String planJson = geminiService.generateMealPlan(request, allRecipes);

        // 3. Return JSON directly (it's already a JSON string)
        // We set content type to JSON so frontend parses it automatically if valid
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(planJson);
    }
}
