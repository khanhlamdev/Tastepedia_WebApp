package com.tastepedia.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tastepedia.backend.model.Recipe;
import com.tastepedia.backend.payload.MealPlanRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public String generateMealPlan(MealPlanRequest request, List<Recipe> poolRecipes) {
        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper mapper = new ObjectMapper();

        // 1. Map ID Tạm -> Recipe Thật
        Map<Integer, Recipe> idMap = new HashMap<>();
        StringBuilder promptContext = new StringBuilder();

        int tempId = 1;
        for (Recipe r : poolRecipes) {
            idMap.put(tempId, r);
            String tags = r.getMealCourse() != null ? String.join(",", r.getMealCourse()) : "";
            promptContext.append(String.format("%d|%s|%d|%s\n",
                    tempId,
                    r.getTitle().replaceAll("\\|", "-"),
                    r.getNutrition() != null ? r.getNutrition().getCalories() : 0,
                    tags
            ));
            tempId++;
        }

        // --- XỬ LÝ SCHEDULE (Linh hoạt theo lựa chọn người dùng) ---
        // Dịch từ tiếng Anh (Frontend gửi) sang tiếng Việt (Cho AI hiểu)
        List<String> userSchedule = request.getMealSchedule();
        if (userSchedule == null || userSchedule.isEmpty()) {
            userSchedule = List.of("Breakfast", "Lunch", "Dinner"); // Mặc định nếu user không chọn
        }

        // Map sang tiếng Việt để đưa vào Prompt
        List<String> vnSchedule = new ArrayList<>();
        for (String meal : userSchedule) {
            if (meal.equalsIgnoreCase("Breakfast")) vnSchedule.add("Bữa Sáng");
            else if (meal.equalsIgnoreCase("Lunch")) vnSchedule.add("Bữa Trưa");
            else if (meal.equalsIgnoreCase("Dinner")) vnSchedule.add("Bữa Tối");
            else if (meal.equalsIgnoreCase("Snack")) vnSchedule.add("Bữa Phụ");
        }
        String scheduleString = String.join(", ", vnSchedule); // Ví dụ: "Bữa Sáng, Bữa Tối"

        // 2. Build Prompt (ĐÃ SỬA ĐỂ FLEXIBLE)
        String prompt = String.format(
                "Bạn là một chuyên gia dinh dưỡng AI. Hãy lập kế hoạch ăn uống 7 ngày cho người dùng.\n" +
                        "DỮ LIỆU NGƯỜI DÙNG:\n" +
                        "- Mục tiêu: %s\n" +
                        "- Chế độ ăn/Dị ứng: %s, %s\n\n" +
                        "KHO MÓN ĂN (ID | Tên | Calo | Tags):\n%s\n\n" +
                        "LUẬT BẮT BUỘC:\n" +
                        "1. Chỉ chọn món từ danh sách ID trên.\n" +
                        "2. QUAN TRỌNG: Kết quả trả về bằng TIẾNG VIỆT.\n" +
                        "3. CẤU TRÚC BỮA ĂN: Mỗi ngày chỉ được tạo các bữa sau: [%s]. Không tự ý thêm bữa khác.\n" +
                        "4. Trả về đúng định dạng JSON.\n" +
                        "ĐỊNH DẠNG OUTPUT (JSON Strict):\n" +
                        "{\n" +
                        "  \"analysis\": \"Lời khuyên...\",\n" +
                        "  \"days\": [\n" +
                        "    {\n" +
                        "      \"day\": \"Thứ Hai\",\n" +
                        "      \"meals\": [\n" +
                        "        { \"type\": \"Bữa Sáng\", \"id\": 1, \"reason\": \"...\" }\n" +
                        "      ]\n" +
                        "    }\n" +
                        "  ]\n" +
                        "}\n" +
                        "Return raw JSON only. No markdown.",
                request.getGoal(), request.getDietaryPreference(), request.getAllergies(),
                promptContext.toString(),
                scheduleString // <-- CHỖ NÀY LÀ BIẾN LINH HOẠT
        );

        // 3. Send Request
        try {
            ObjectNode content = mapper.createObjectNode();
            ArrayNode parts = content.putArray("parts");
            parts.addObject().put("text", prompt);

            ArrayNode contents = mapper.createArrayNode();
            contents.add(mapper.createObjectNode().set("parts", parts));

            ObjectNode requestBody = mapper.createObjectNode();
            requestBody.set("contents", contents);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    GEMINI_API_URL + apiKey,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String rawAiJson = extractTextFromGeminiResponse(response.getBody());
            return rehydratePlan(rawAiJson, idMap, mapper);

        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            // Truyền cả lịch ăn của user vào hàm Fallback
            return generateFallbackPlan(poolRecipes, mapper, vnSchedule);
        }
    }

    private String rehydratePlan(String rawJson, Map<Integer, Recipe> idMap, ObjectMapper mapper) {
        try {
            JsonNode rootNode = mapper.readTree(rawJson);
            if (rootNode instanceof ObjectNode) {
                ObjectNode root = (ObjectNode) rootNode;
                if (root.has("days")) {
                    for (JsonNode dayNode : root.get("days")) {
                        if (dayNode.has("meals")) {
                            ArrayNode meals = (ArrayNode) dayNode.get("meals");
                            for (int i = 0; i < meals.size(); i++) {
                                ObjectNode meal = (ObjectNode) meals.get(i);
                                if (meal.has("id")) {
                                    int tempId = meal.get("id").asInt();
                                    Recipe realRecipe = idMap.get(tempId);
                                    if (realRecipe != null) {
                                        meal.put("recipeName", realRecipe.getTitle());
                                        meal.put("recipeId", realRecipe.getId());
                                        String img = realRecipe.getMainImageUrl();
                                        if (img == null || img.isEmpty()) {
                                            img = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";
                                        }
                                        meal.put("image", img);
                                        meal.put("calories", realRecipe.getNutrition() != null ? realRecipe.getNutrition().getCalories() : 0);
                                    } else {
                                        meal.put("recipeName", "Gợi ý món ăn");
                                        meal.put("image", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600");
                                        meal.put("reason", "Không tìm thấy dữ liệu.");
                                    }
                                }
                            }
                        }
                    }
                }
                return root.toString();
            }
            return rawJson;
        } catch (Exception e) {
            return rawJson;
        }
    }

    private String extractTextFromGeminiResponse(String jsonResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonResponse);
            String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            return text.replace("```json", "").replace("```", "").trim();
        } catch (Exception e) {
            return "{\"error\": \"Lỗi phân tích AI\"}";
        }
    }

    // --- FALLBACK CŨNG PHẢI LINH HOẠT ---
    private String generateFallbackPlan(List<Recipe> pool, ObjectMapper mapper, List<String> vnSchedule) {
        ObjectNode root = mapper.createObjectNode();
        root.put("analysis", "Hệ thống AI đang bận. Đây là thực đơn ngẫu nhiên dựa trên lịch ăn bạn chọn.");

        ArrayNode days = root.putArray("days");
        String[] weekDays = {"Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"};

        int recipeIndex = 0;

        for (String dayName : weekDays) {
            ObjectNode day = days.addObject();
            day.put("day", dayName);
            ArrayNode meals = day.putArray("meals");

            // CHỈ TẠO CÁC BỮA MÀ USER ĐÃ CHỌN
            for (String time : vnSchedule) {
                if (pool.isEmpty()) break;
                Recipe chosen = pool.get(recipeIndex % pool.size());
                recipeIndex++;

                ObjectNode meal = meals.addObject();
                meal.put("type", time); // Ví dụ: "Bữa Sáng" hoặc "Bữa Tối" tùy user chọn
                meal.put("recipeId", chosen.getId());
                meal.put("recipeName", chosen.getTitle());
                meal.put("calories", chosen.getNutrition() != null ? chosen.getNutrition().getCalories() : 0);

                String img = chosen.getMainImageUrl();
                if (img == null || img.isEmpty()) img = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";
                meal.put("image", img);
                meal.put("reason", "Gợi ý thay thế");
            }
        }
        return root.toString();
    }
}