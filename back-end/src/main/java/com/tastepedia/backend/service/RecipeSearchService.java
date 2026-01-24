package com.tastepedia.backend.service;

import com.tastepedia.backend.model.Recipe;
import com.tastepedia.backend.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecipeSearchService {

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Recipe> searchRecipes(String keyword, List<String> cuisines, List<String> dietaryTypes, Integer cookTimeMax, Integer caloriesMax, Integer carbMax, Integer fatMax, Integer proteinMax, Double minPrice, Double maxPrice) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        // 1. Tìm theo tên (keyword) - Dùng Shadow Field (searchText)
        if (keyword != null && !keyword.trim().isEmpty()) {
            // Chuyển từ khóa tìm kiếm sang không dấu: "Bánh" -> "banh"
            String keywordNoAccent = StringUtils.removeAccent(keyword.trim()).toLowerCase();
            
            // Tìm trên trường searchText
            // OR logic: Tìm trên title (cho chắc) HOẶC searchText
            Criteria titleCriteria = Criteria.where("title").regex(keyword, "i"); // Tìm có dấu
            Criteria shadowCriteria = Criteria.where("searchText").regex(keywordNoAccent, "i"); // Tìm không dấu (chính xác hơn)
            
            criteriaList.add(new Criteria().orOperator(titleCriteria, shadowCriteria));
        }

        // 2. Tìm theo Quốc gia (cuisine) - Hỗ trợ nhiều quốc gia (OR logic inside category)
        if (cuisines != null && !cuisines.isEmpty()) {
            criteriaList.add(Criteria.where("cuisine").in(cuisines));
        }

        // 3. Tìm theo Loại ăn uống (dietaryType) - Hỗ trợ nhiều loại
        if (dietaryTypes != null && !dietaryTypes.isEmpty()) {
            criteriaList.add(Criteria.where("dietaryType").in(dietaryTypes));
        }

        // 4. Thời gian nấu tối đa
        if (cookTimeMax != null && cookTimeMax > 0) {
            criteriaList.add(Criteria.where("cookTime").lte(cookTimeMax));
        }

        // 5. Dinh dưỡng (Calories, Carb, Fat, Protein)
        if (caloriesMax != null && caloriesMax > 0) {
            criteriaList.add(Criteria.where("nutrition.calories").lte(caloriesMax));
        }
        if (carbMax != null && carbMax > 0) {
            criteriaList.add(Criteria.where("nutrition.carb").lte(carbMax));
        }
        if (fatMax != null && fatMax > 0) {
            criteriaList.add(Criteria.where("nutrition.fat").lte(fatMax));
        }
        if (proteinMax != null && proteinMax > 0) {
            criteriaList.add(Criteria.where("nutrition.protein").lte(proteinMax));
        }

        // 6. Khoảng giá (totalCost)
        if (minPrice != null || maxPrice != null) {
            if (minPrice != null && maxPrice != null) {
                criteriaList.add(Criteria.where("totalCost").gte(minPrice).lte(maxPrice));
            } else if (minPrice != null) {
                criteriaList.add(Criteria.where("totalCost").gte(minPrice));
            } else if (maxPrice != null) {
                criteriaList.add(Criteria.where("totalCost").lte(maxPrice));
            }
        }

        // Gộp các điều kiện lại (Dùng AND)
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Recipe.class);
    }
}
