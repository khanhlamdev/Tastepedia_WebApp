package com.tastepedia.backend.repository;

import com.tastepedia.backend.model.StoreProduct;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreProductRepository extends MongoRepository<StoreProduct, String> {
    List<StoreProduct> findByStoreId(String storeId);
    List<StoreProduct> findByIngredientNameInAndQuantityGreaterThan(List<String> ingredientNames, int quantity);
}
