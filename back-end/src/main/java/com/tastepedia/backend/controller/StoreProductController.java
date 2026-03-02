package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.StoreProduct;
import com.tastepedia.backend.model.User;
import com.tastepedia.backend.repository.StoreProductRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/store-products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class StoreProductController {

    @Autowired
    private StoreProductRepository productRepository;

    /**
     * GET /api/store-products
     * Lấy danh sách sản phẩm của cửa hàng (Dành cho Store Owner).
     */
    @GetMapping
    public ResponseEntity<?> getMyProducts(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null || !"STORE".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Store Owners only"));
        }
        
        List<StoreProduct> products = productRepository.findByStoreId(currentUser.getStoreId());
        return ResponseEntity.ok(products);
    }

    /**
     * POST /api/store-products
     * Store owner thêm sản phẩm mới.
     */
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody StoreProduct product, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null || !"STORE".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Store Owners only"));
        }

        product.setStoreId(currentUser.getStoreId());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        
        StoreProduct savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    /**
     * PUT /api/store-products/{id}
     * Store owner cập nhật sản phẩm.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody StoreProduct updatedProduct, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null || !"STORE".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Store Owners only"));
        }

        return productRepository.findById(id).map(product -> {
            // Kiểm tra quyền sở hữu
            if (!product.getStoreId().equals(currentUser.getStoreId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Cannot edit other store's product"));
            }

            product.setIngredientName(updatedProduct.getIngredientName());
            product.setDisplayName(updatedProduct.getDisplayName());
            product.setPrice(updatedProduct.getPrice());
            product.setUnit(updatedProduct.getUnit());
            product.setQuantity(updatedProduct.getQuantity());
            product.setImageUrl(updatedProduct.getImageUrl());
            product.setUpdatedAt(LocalDateTime.now());

            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/store-products/{id}
     * Store owner xoá sản phẩm.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null || !"STORE".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Store Owners only"));
        }

        return productRepository.findById(id).map(product -> {
            if (!product.getStoreId().equals(currentUser.getStoreId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
            }
            productRepository.delete(product);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/store-products/match
     * CartPage gọi API này truyền lên danh sách tên nguyên liệu,
     * trả về các StoreProduct khớp tên và còn hàng.
     */
    @PostMapping("/match")
    public ResponseEntity<?> matchIngredients(@RequestBody List<String> ingredientNames) {
        if (ingredientNames == null || ingredientNames.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Empty ingredient list"));
        }
        
        List<StoreProduct> matches = productRepository.findByIngredientNameInAndQuantityGreaterThan(ingredientNames, 0);
        return ResponseEntity.ok(matches);
    }
}
