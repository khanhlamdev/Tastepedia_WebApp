package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.Store;
import com.tastepedia.backend.model.User;
import com.tastepedia.backend.repository.StoreRepository;
import com.tastepedia.backend.repository.UserRepository;
import com.tastepedia.backend.service.EmailService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class StoreController {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    /**
     * GET /api/stores
     * Lấy danh sách tất cả cửa hàng đang hoạt động (public — để user chọn khi checkout).
     */
    @GetMapping
    public List<Store> getAllStores() {
        return storeRepository.findAllByIsActiveTrue();
    }

    /**
     * GET /api/stores/{id}
     * Chi tiết 1 cửa hàng.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getStore(@PathVariable String id) {
        Optional<Store> storeOpt = storeRepository.findByIdAndIsActiveTrue(id);
        return storeOpt.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/stores
     * Admin tạo cửa hàng mới.
     */
    @PostMapping
    public ResponseEntity<?> createStore(@RequestBody Store store, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null || !"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Admin only"));
        }
        store.setActive(true);
        return ResponseEntity.ok(storeRepository.save(store));
    }

    /**
     * PUT /api/stores/{id}
     * Admin hoặc chủ cửa hàng cập nhật thông tin.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStore(@PathVariable String id,
                                          @RequestBody Store updatedStore,
                                          HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        boolean isAdmin = "ADMIN".equalsIgnoreCase(currentUser.getRole());
        boolean isStoreOwner = "STORE".equalsIgnoreCase(currentUser.getRole())
                && id.equals(currentUser.getStoreId());

        if (!isAdmin && !isStoreOwner) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        return storeRepository.findById(id).map(store -> {
            if (updatedStore.getName() != null) store.setName(updatedStore.getName());
            if (updatedStore.getAddress() != null) store.setAddress(updatedStore.getAddress());
            if (updatedStore.getPhone() != null) store.setPhone(updatedStore.getPhone());
            if (updatedStore.getOpenTime() != null) store.setOpenTime(updatedStore.getOpenTime());
            if (updatedStore.getCloseTime() != null) store.setCloseTime(updatedStore.getCloseTime());
            if (updatedStore.getImageUrl() != null) store.setImageUrl(updatedStore.getImageUrl());
            if (updatedStore.getDescription() != null) store.setDescription(updatedStore.getDescription());
            store.setLatitude(updatedStore.getLatitude());
            store.setLongitude(updatedStore.getLongitude());
            return ResponseEntity.ok(storeRepository.save(store));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/stores/{id}
     * Admin deactivate cửa hàng (soft delete).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateStore(@PathVariable String id, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null || !"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Admin only"));
        }
        return storeRepository.findById(id).map(store -> {
            store.setActive(false);
            storeRepository.save(store);
            return ResponseEntity.ok(Map.of("message", "Store deactivated"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ========================================================================
    // STORE SELF-REGISTRATION — Không cần Admin, Store tự đăng ký
    // ========================================================================

    /**
     * POST /api/stores/register
     * Body: {
     *   storeName, address, phone, openTime, closeTime, description, imageUrl,
     *   ownerFullName, ownerEmail, ownerUsername, ownerPassword
     * }
     * Flow: Geocode address → Tạo Store document → Tạo User{role:STORE} → Link storeId
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerStore(@RequestBody Map<String, String> body) {
        String ownerEmail    = body.get("ownerEmail");
        String ownerUsername = body.get("ownerUsername");
        String ownerPassword = body.get("ownerPassword");
        String ownerFullName = body.get("ownerFullName");
        String storeName     = body.get("storeName");
        String address       = body.get("address");
        String phone         = body.get("phone");

        // --- Validate bắt buộc ---
        if (ownerEmail == null || ownerUsername == null || ownerPassword == null
                || storeName == null || address == null || phone == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng điền đầy đủ thông tin bắt buộc"));
        }

        // --- Kiểm tra trùng email / username ---
        if (userRepository.existsByEmail(ownerEmail)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email này đã được sử dụng"));
        }
        if (userRepository.existsByUsername(ownerUsername)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username này đã được sử dụng"));
        }

        // --- Geocode địa chỉ → lat/lng (Nominatim / OpenStreetMap) ---
        double[] coords = geocodeAddress(address);

        // --- Tạo Store document ---
        Store store = new Store();
        store.setName(storeName);
        store.setAddress(address);
        store.setPhone(phone);
        store.setOpenTime(body.getOrDefault("openTime", "07:00"));
        store.setCloseTime(body.getOrDefault("closeTime", "22:00"));
        store.setDescription(body.getOrDefault("description", ""));
        store.setImageUrl(body.getOrDefault("imageUrl", ""));
        store.setLatitude(coords[0]);
        store.setLongitude(coords[1]);
        store.setActive(true);
        Store savedStore = storeRepository.save(store);

        // --- Tạo User tài khoản STORE ---
        User owner = new User();
        owner.setFullName(ownerFullName != null ? ownerFullName : ownerUsername);
        owner.setUsername(ownerUsername);
        owner.setEmail(ownerEmail);
        owner.setPassword(passwordEncoder.encode(ownerPassword));
        owner.setRole("STORE");
        owner.setStoreId(savedStore.getId());
        owner.setVerified(true);  // Tự xác thực ngay, không dùng OTP
        userRepository.save(owner);

        // --- Gửi email chào mừng ---
        try {
            emailService.sendEmail(
                    ownerEmail,
                    "Chào mừng " + storeName + " đến với Tastepedia!",
                    "Xin chào " + (ownerFullName != null ? ownerFullName : ownerUsername) + ",\n\n" +
                    "Cửa hàng \"" + storeName + "\" đã đăng ký thành công trên Tastepedia!\n\n" +
                    "Thông tin đăng nhập:\n" +
                    "  Username: " + ownerUsername + "\n" +
                    "  Mật khẩu: (như bạn đã nhập)\n\n" +
                    "Truy cập: http://localhost:3000/store-dashboard\n\n" +
                    "Trân trọng,\nĐội ngũ Tastepedia"
            );
        } catch (Exception ignored) {}

        return ResponseEntity.ok(Map.of(
                "message", "Đăng ký thành công! Bạn có thể đăng nhập ngay.",
                "storeId", savedStore.getId(),
                "storeName", savedStore.getName()
        ));
    }

    // ========================================================================
    // PRIVATE — Nominatim Geocoding
    // ========================================================================

    /**
     * Gọi Nominatim (OpenStreetMap) để convert địa chỉ → [latitude, longitude].
     * Trả về [0.0, 0.0] nếu không tìm thấy (không blocking).
     */
    private double[] geocodeAddress(String address) {
        try {
            String encoded = URLEncoder.encode(address, StandardCharsets.UTF_8);
            String url = "https://nominatim.openstreetmap.org/search?q=" + encoded + "&format=json&limit=1";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    // Nominatim yêu cầu User-Agent để tránh bị block
                    .header("User-Agent", "Tastepedia/1.0 (tastepediaverified@gmail.com)")
                    .GET()
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            String body2 = response.body();
            // Parse JSON thủ công (tránh thêm dependency)
            // Format: [{"lat":"10.77","lon":"106.70",...}]
            if (body2.contains("\"lat\":")) {
                int latIdx = body2.indexOf("\"lat\":") + 7;
                int latEnd = body2.indexOf("\"", latIdx);
                int lonIdx = body2.indexOf("\"lon\":") + 7;
                int lonEnd = body2.indexOf("\"", lonIdx);
                double lat = Double.parseDouble(body2.substring(latIdx, latEnd));
                double lon = Double.parseDouble(body2.substring(lonIdx, lonEnd));
                return new double[]{lat, lon};
            }
        } catch (IOException | InterruptedException | NumberFormatException e) {
            System.err.println("[Geocoding] Không thể convert địa chỉ: " + e.getMessage());
        }
        return new double[]{0.0, 0.0}; // Fallback
    }
}
