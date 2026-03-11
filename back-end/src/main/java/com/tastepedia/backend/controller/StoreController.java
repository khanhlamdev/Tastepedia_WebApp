package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.Store;
import com.tastepedia.backend.model.User;
import com.tastepedia.backend.repository.StoreRepository;
import com.tastepedia.backend.repository.UserRepository;
import com.tastepedia.backend.service.EmailService;
import com.tastepedia.backend.service.LocationService;
import com.tastepedia.backend.service.OtpCacheService;
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
public class StoreController {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpCacheService otpCacheService;

    @Autowired
    private LocationService locationService;

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
        double[] coords = locationService.geocodeAddress(address);

        // --- Tạo OTP và lưu vào Cache thay vì DB ---
        String randomOtp = String.valueOf((int) ((Math.random() * 900000) + 100000));
        otpCacheService.savePendingStore(ownerEmail, body, randomOtp, coords[0], coords[1]);

        // --- Gửi email OTP ---
        try {
            emailService.sendEmail(
                    ownerEmail,
                    "Mã xác định đăng ký Cửa hàng Tastepedia",
                    "Xin chào " + (ownerFullName != null ? ownerFullName : ownerUsername) + ",\n\n" +
                    "Mã OTP xác nhận đăng ký cửa hàng \"" + storeName + "\" của bạn là: <strong>" + randomOtp + "</strong>\n\n" +
                    "Mã này có hiệu lực trong 10 phút.\n\n" +
                    "Trân trọng,\nĐội ngũ Tastepedia"
            );
        } catch (Exception ignored) {}

        return ResponseEntity.ok(Map.of(
                "message", "Đã gửi mã OTP về email. Vui lòng kiểm tra!"
        ));
    }

    /**
     * POST /api/stores/verify
     * Body: { email, otp }
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyStore(@RequestBody Map<String, String> body, HttpSession session) {
        String email = body.get("email");
        String otp = body.get("otp");

        OtpCacheService.PendingStore pendingStore = otpCacheService.getPendingStore(email);
        if (pendingStore == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email không có yêu cầu đăng ký hoặc yêu cầu đã hết hạn"));
        }

        if (!pendingStore.otp.equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mã OTP không đúng"));
        }

        Map<String, String> request = pendingStore.request;
        String ownerUsername = request.get("ownerUsername");

        if (userRepository.existsByEmail(email) || userRepository.existsByUsername(ownerUsername)) {
            otpCacheService.removePendingStore(email);
            return ResponseEntity.badRequest().body(Map.of("error", "Tài khoản hoặc cửa hàng này đã tồn tại"));
        }

        // --- Tạo Store document ---
        Store store = new Store();
        store.setName(request.get("storeName"));
        store.setAddress(request.get("address"));
        store.setPhone(request.get("phone"));
        store.setOpenTime(request.getOrDefault("openTime", "07:00"));
        store.setCloseTime(request.getOrDefault("closeTime", "22:00"));
        store.setDescription(request.getOrDefault("description", ""));
        store.setImageUrl(request.getOrDefault("imageUrl", ""));
        store.setLatitude(pendingStore.lat);
        store.setLongitude(pendingStore.lng);
        store.setActive(true);
        Store savedStore = storeRepository.save(store);

        // --- Tạo User tài khoản STORE ---
        User owner = new User();
        String ownerFullName = request.get("ownerFullName");
        owner.setFullName(ownerFullName != null ? ownerFullName : ownerUsername);
        owner.setUsername(ownerUsername);
        owner.setEmail(email);
        owner.setPassword(passwordEncoder.encode(request.get("ownerPassword")));
        owner.setRole("STORE");
        owner.setStoreId(savedStore.getId());
        owner.setVerified(true);  // Xác thực thành công
        userRepository.save(owner);

        // Xóa cache
        otpCacheService.removePendingStore(email);

        // Tự động đăng nhập
        session.setAttribute("MY_SESSION_USER", owner);
        session.setMaxInactiveInterval(30 * 60);

        return ResponseEntity.ok(owner); // Trả về thông tin user như login
    }
}
