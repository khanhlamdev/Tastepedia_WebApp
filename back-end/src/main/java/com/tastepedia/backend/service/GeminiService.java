package com.tastepedia.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tastepedia.backend.model.Recipe;
import com.tastepedia.backend.payload.MealPlanRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=";

    public String generateMealPlan(MealPlanRequest request, List<Recipe> allRecipes) {
        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper mapper = new ObjectMapper();
        
        // 1. Prepare Recipe Data Context (Simplify to save tokens)
        String recipeContext = allRecipes.stream()
                .limit(50) 
                .map(r -> String.format("- ID: %s, Name: %s, Cal: %d, Type: %s, Cuisine: %s", 
                        r.getId(), r.getTitle(), 
                        r.getNutrition() != null ? r.getNutrition().getCalories() : 0,
                        r.getDietaryType(), r.getCuisine()))
                .collect(Collectors.joining("\n"));

        // ... (Prompt construction remains the same) ...
        String prompt = String.format(
            "You are an expert Nutritionist AI. Plan a 7-day meal plan based on the following USER DATA:\n" +
            "- Goal: %s\n" +
            "- Activity Level: %s\n" +
            "- Diet: %s\n" +
            "- Allergies: %s\n" +
            "- Dislikes: %s\n" +
            "- Budget: %s\n" +
            "- Time Constraint: %s\n" +
            "- Meals/Day: %d\n\n" +
            "AVAILABLE RECIPES (Select exclusively from this list if possible, otherwise suggest generic healthy meals but mark them as 'Generic'):\n%s\n\n" +
            "OUTPUT FORMAT (Strict JSON):\n" +
            "{\n" +
            "  \"analysis\": \"Brief explanation of why this plan fits the user's goal (calories, nutrients profile).\",\n" +
            "  \"days\": [\n" +
            "    {\n" +
            "      \"day\": \"Monday\",\n" +
            "      \"meals\": [\n" +
            "        { \"type\": \"Breakfast\", \"recipeId\": \"...\", \"recipeName\": \"...\", \"calories\": 500, \"reason\": \"High protein start\" }\n" +
            "      ]\n" +
            "    }\n" +
            "  ]\n" +
            "}\n" +
            "Do not include markdown formatting (```json). Return raw JSON only.",
            request.getGoal(), request.getActivityLevel(), request.getDietaryPreference(),
            request.getAllergies(), request.getDislikedIngredients(), request.getBudget(),
            request.getCookingTime(), request.getMealsPerDay(),
            recipeContext
        );

        // 3. Build Request Body
        try {
            ObjectNode content = mapper.createObjectNode();
            ArrayNode parts = content.putArray("parts");
            parts.addObject().put("text", prompt);

            ArrayNode contents = mapper.createArrayNode();
            contents.add(mapper.createObjectNode().set("parts", parts));

            ObjectNode requestBody = mapper.createObjectNode();
            requestBody.set("contents", contents);

            // 4. Send Request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    GEMINI_API_URL + apiKey,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // 5. Parse Response
            return extractTextFromGeminiResponse(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            // Safe JSON Error Construction
            ObjectNode errorNode = mapper.createObjectNode();
            errorNode.put("error", "Failed to generate plan: " + e.getMessage());
            return errorNode.toString();
        }
    }

    private String extractTextFromGeminiResponse(String jsonResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode root = (ObjectNode) mapper.readTree(jsonResponse);
            return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText()
                    .replace("```json", "").replace("```", "").trim();
        } catch (Exception e) {
            return "{\"error\": \"Failed to parse AI response\"}";
        }
    }
}
