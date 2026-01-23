package com.tastepedia.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        // --- SỬA ĐOẠN NÀY ---
        // Thêm tham số "resource_type", "auto" để Cloudinary tự nhận diện là Video hay Ảnh
        // Nếu là Video, nó sẽ cho phép dung lượng > 10MB (tối đa 100MB bản Free)
        Map params = ObjectUtils.asMap(
                "resource_type", "auto",
                "folder", "tastepedia_recipes" // (Tùy chọn) Gom vào thư mục cho gọn
        );

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

        // --------------------

        return uploadResult.get("secure_url").toString();
    }
}