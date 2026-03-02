package com.tastepedia.backend.repository;

import com.tastepedia.backend.model.Store;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StoreRepository extends MongoRepository<Store, String> {

    // Lấy tất cả cửa hàng đang hoạt động
    List<Store> findAllByIsActiveTrue();

    // Tìm cửa hàng theo id và đang active
    java.util.Optional<Store> findByIdAndIsActiveTrue(String id);
}
