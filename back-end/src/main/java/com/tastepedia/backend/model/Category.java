package com.tastepedia.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "categories")
public class Category {
    @Id
    private String id;
    
    private String name; // Ví dụ: "Bữa Sáng", "Ăn Kiêng Keto"
    private String description;
    
    private String type; // Ví dụ: "dietaryType", "mealCourse", "cuisine"
}
