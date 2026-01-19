package com.tastepedia.backend.repository;

import com.tastepedia.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    // Tự động tạo hàm tìm User bằng Email (để check đăng nhập)
    Optional<User> findByEmail(String email);

    // Kiểm tra xem email đã tồn tại chưa (để chặn đăng ký trùng)
    Boolean existsByEmail(String email);
}