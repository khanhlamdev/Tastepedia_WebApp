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
import java.util.stream.Collectors;

@Service
public class GrokService {

    @Value("${grok.api-key}")
    private String apiKey;

    private final String GROK_API_URL = "https://api.x.ai/v1/chat/completions";

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

        String systemPrompt = "You are an expert Nutritionist AI.";
        String userPrompt = String.format(
            "Plan a 7-day meal plan based on the following USER DATA:\n" +
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

        // 3. Build Request Body for Grok / OpenAI compatible API
        try {
            // Grok uses the standard OpenAI chat completions format
            ObjectNode requestBody = mapper.createObjectNode();
            requestBody.put("model", "grok-4-latest");
            requestBody.put("stream", false);
            requestBody.put("temperature", 0);
            
            ArrayNode messages = requestBody.putArray("messages");
            
            ObjectNode systemMessage = messages.addObject();
            systemMessage.put("role", "system");
            systemMessage.put("content", systemPrompt);
            
            ObjectNode userMessage = messages.addObject();
            userMessage.put("role", "user");
            userMessage.put("content", userPrompt);

            // 4. Send Request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            
            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    GROK_API_URL,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // 5. Parse Response
            return extractTextFromGrokResponse(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            // Safe JSON Error Construction
            ObjectNode errorNode = mapper.createObjectNode();
            errorNode.put("error", "Failed to generate plan with Grok: " + e.getMessage());
            return errorNode.toString();
        }
    }

    private String extractTextFromGrokResponse(String jsonResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode root = (ObjectNode) mapper.readTree(jsonResponse);
            String content = root.path("choices").get(0).path("message").path("content").asText();
            
            // Cleanup potential markdown code blocks if the model ignores the instruction
            return content.replace("```json", "").replace("```", "").trim();
        } catch (Exception e) {
            return "{\"error\": \"Failed to parse Grok AI response\"}";
        }
    }
}
