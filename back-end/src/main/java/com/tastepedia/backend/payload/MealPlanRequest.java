package com.tastepedia.backend.payload;

import lombok.Data;
import java.util.List;

@Data
public class MealPlanRequest {
    private String goal;             // e.g., "Weight Loss", "Muscle Gain"
    private String activityLevel;    // e.g., "Sedentary", "Active"
    private String dietaryPreference;// e.g., "Vegan", "Keto", "None"
    private List<String> allergies;  // e.g., ["Peanuts", "Shellfish"]
    private String dislikedIngredients; // Free text
    private String budget;           // e.g., "Economy", "Premium"
    private String cookingTime;      // e.g., "Under 30 mins"
    private int mealsPerDay;         // e.g., 3, 4

    // --- V2.0 New Filter Fields ---
    private List<String> kitchenTools; // e.g., ["Rice Cooker", "Oven"]
    private String preferredCuisine;   // e.g., "Vietnamese", "All"
    private List<String> mealSchedule; // e.g., ["Breakfast", "Lunch", "Dinner"]
}
