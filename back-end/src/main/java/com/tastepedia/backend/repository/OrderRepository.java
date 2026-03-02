package com.tastepedia.backend.repository;

import com.tastepedia.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    // Lịch sử đơn của user (mới nhất trước)
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);

    // Đơn của cửa hàng theo danh sách trạng thái (mới nhất trước)
    List<Order> findByStoreIdAndStatusInOrderByCreatedAtDesc(String storeId, List<String> statuses);

    // Tất cả đơn của cửa hàng
    List<Order> findByStoreIdOrderByCreatedAtDesc(String storeId);
}
