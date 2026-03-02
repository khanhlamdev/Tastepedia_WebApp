package com.tastepedia.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Thông tin siêu thị / cửa hàng.
 * Tài khoản role = "STORE" sẽ có storeId trỏ đến document này.
 */
@Document(collection = "stores")
public class Store {

    @Id
    private String id;

    private String name;         // VD: "WinMart Quận 1"
    private String address;      // Địa chỉ đầy đủ
    private String phone;

    // GPS coordinates (dùng Haversine ở frontend để tìm cửa hàng gần nhất)
    private double latitude;
    private double longitude;

    // Giờ hoạt động
    private String openTime;     // VD: "07:00"
    private String closeTime;    // VD: "22:00"

    private String imageUrl;
    private String description;
    private boolean isActive = true;

    public Store() {}

    // --- Getters & Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getOpenTime() { return openTime; }
    public void setOpenTime(String openTime) { this.openTime = openTime; }

    public String getCloseTime() { return closeTime; }
    public void setCloseTime(String closeTime) { this.closeTime = closeTime; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
