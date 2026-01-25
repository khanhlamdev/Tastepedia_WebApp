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

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        // Validate folder để tránh upload vào folder không hợp lệ
        String validFolder = folder;
        if (!folder.equals("community/posts") && 
            !folder.equals("community/comments") && 
            !folder.equals("tastepedia_recipes")) {
            validFolder = "community/posts"; // Default folder
        }

        Map params = ObjectUtils.asMap(
                "resource_type", "auto",
                "folder", validFolder
        );

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

        return uploadResult.get("secure_url").toString();
    }

    // Overload method để backward compatibility
    public String uploadImage(MultipartFile file) throws IOException {
        return uploadImage(file, "tastepedia_recipes");
    }
}