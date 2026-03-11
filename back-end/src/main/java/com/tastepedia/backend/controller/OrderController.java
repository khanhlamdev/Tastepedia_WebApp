package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.Order;
import com.tastepedia.backend.model.Store;
import com.tastepedia.backend.model.User;
import com.tastepedia.backend.model.StoreProduct;
import com.tastepedia.backend.repository.OrderRepository;
import com.tastepedia.backend.repository.UserRepository;
import com.tastepedia.backend.repository.StoreProductRepository;
import com.tastepedia.backend.repository.StoreRepository;
import com.tastepedia.backend.service.NotificationService;
import com.tastepedia.backend.service.LocationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private StoreProductRepository storeProductRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationService locationService;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    // -----------------------------------------------------------------------
    // USER: Tính phí giao hàng động
    // -----------------------------------------------------------------------
    @GetMapping("/calculate-fee")
    public ResponseEntity<?> calculateDeliveryFee(@RequestParam String storeId, @RequestParam String address) {
        if (address == null || address.trim().isEmpty() || storeId == null || storeId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vùng bắt buộc address và storeId bị thiếu"));
        }

        Optional<Store> storeOpt = storeRepository.findById(storeId);
        if (storeOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cửa hàng không tồn tại"));
        }

        Store store = storeOpt.get();
        if (store.getLatitude() == 0.0 || store.getLongitude() == 0.0) {
            // Cửa hàng chưa có toạ độ hợp lệ (thường do lỗi geocode lúc đăng ký), mặc định phí
            return ResponseEntity.ok(Map.of(
                    "distanceKm", 0.0,
                    "deliveryFee", 15000.0
            ));
        }

        double[] userCoords = locationService.geocodeAddress(address);
        if (userCoords[0] == 0.0 && userCoords[1] == 0.0) {
            // Không map được địa chỉ khách
            return ResponseEntity.ok(Map.of(
                    "distanceKm", 0.0,
                    "deliveryFee", 15000.0 // Phí mặc định
            ));
        }

        double distanceKm = locationService.calculateHaversineDistance(
                store.getLatitude(), store.getLongitude(),
                userCoords[0], userCoords[1]
        );

        // Quy tắc: Giá cơ bản 15.000đ cho 2km đầu, từ km thứ 3 thêm 5.000đ/km
        double fee = 15000.0;
        if (distanceKm > 2.0) {
            fee += Math.ceil(distanceKm - 2.0) * 5000.0;
        }

        // Tối đa 150k phí ship
        fee = Math.min(fee, 150000.0);

        return ResponseEntity.ok(Map.of(
                "distanceKm", Math.round(distanceKm * 10.0) / 10.0,
                "deliveryFee", fee
        ));
    }

    // -----------------------------------------------------------------------
    // USER: Tạo đơn hàng
    // -----------------------------------------------------------------------
    /**
     * POST /api/orders
     * Body: { storeId, items: [...], userPhone, userAddress, paymentMethod, note, totalAmount }
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        // Validate storeId
        Optional<Store> storeOpt = storeRepository.findById(order.getStoreId());
        if (storeOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Store không tồn tại"));
        }
        Store store = storeOpt.get();
        if (!store.isActive()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cửa hàng hiện đang đóng cửa"));
        }

        // Cập nhật sđt/địa chỉ của user nếu chưa có hoặc có sự thay đổi
        boolean userUpdated = false;
        
        // Lấy lại user mới nhất từ DB để chắc chắn
        Optional<User> dbUserOpt = userRepository.findById(currentUser.getId());
        if (dbUserOpt.isPresent()) {
            User dbUser = dbUserOpt.get();
            
            // Note: we trust the payload string instead of session because the user might have edited it on the CartPage
            if (order.getUserPhone() != null && !order.getUserPhone().trim().isEmpty() 
                && !order.getUserPhone().equals(dbUser.getPhone())) {
                dbUser.setPhone(order.getUserPhone());
                userUpdated = true;
            }
            if (order.getUserAddress() != null && !order.getUserAddress().trim().isEmpty() 
                && !order.getUserAddress().equals(dbUser.getAddress())) {
                dbUser.setAddress(order.getUserAddress());
                userUpdated = true;
            }
            
            if (userUpdated) {
                userRepository.save(dbUser);
                session.setAttribute("MY_SESSION_USER", dbUser); // Cập nhật session
                currentUser = dbUser;
            }
        }

        // Gán thông tin user
        order.setUserId(currentUser.getId());
        order.setUserFullName(currentUser.getFullName());
        
        // Dùng giá trị từ payload nếu có, ko thì fallback về profile của user, ko nữa thì fallback default
        order.setUserPhone((order.getUserPhone() != null && !order.getUserPhone().trim().isEmpty()) 
            ? order.getUserPhone() 
            : (currentUser.getPhone() != null ? currentUser.getPhone() : "Chưa cung cấp"));
            
        order.setUserAddress((order.getUserAddress() != null && !order.getUserAddress().trim().isEmpty()) 
            ? order.getUserAddress() 
            : (currentUser.getAddress() != null ? currentUser.getAddress() : "Chưa cung cấp địa chỉ"));
            
        order.setStoreName(store.getName());
        order.setStatus("PENDING");

        Order saved = orderRepository.save(order);

        // Deduct quantity from store products
        if (order.getItems() != null) {
            List<StoreProduct> storeProducts = storeProductRepository.findByStoreId(store.getId());
            for (Order.OrderItem item : order.getItems()) {
                for (StoreProduct sp : storeProducts) {
                    if (sp.getIngredientName().equals(item.getName())) {
                        int newQty = sp.getQuantity() - item.getQty();
                        sp.setQuantity(Math.max(0, newQty));
                        storeProductRepository.save(sp);
                        break;
                    }
                }
            }
        }

        // --- REAL-TIME: Đẩy đơn mới đến Store Dashboard (ting ting!) ---
        notificationService.pushNewOrderToStore(store.getId(), saved);

        return ResponseEntity.ok(saved);
    }

    // -----------------------------------------------------------------------
    // USER: Lịch sử đơn hàng của tôi
    // -----------------------------------------------------------------------
    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return ResponseEntity.ok(orders);
    }

    // -----------------------------------------------------------------------
    // USER / STORE: Chi tiết đơn
    // -----------------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable String id, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();

        // Chỉ user đặt đơn hoặc chủ store mới xem được
        boolean isOwner = order.getUserId().equals(currentUser.getId());
        boolean isStoreOwner = "STORE".equalsIgnoreCase(currentUser.getRole())
                && order.getStoreId().equals(currentUser.getStoreId());
        boolean isAdmin = "ADMIN".equalsIgnoreCase(currentUser.getRole());

        if (!isOwner && !isStoreOwner && !isAdmin) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        return ResponseEntity.ok(order);
    }

    // -----------------------------------------------------------------------
    // STORE: Lấy đơn đang chờ / đang giao của cửa hàng mình
    // -----------------------------------------------------------------------
    @GetMapping("/store/incoming")
    public ResponseEntity<?> getIncomingOrders(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        if (!"STORE".equalsIgnoreCase(currentUser.getRole()) && !"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(403).body("Forbidden: Store only");
        }

        String storeId = currentUser.getStoreId();
        if (storeId == null) return ResponseEntity.badRequest().body("No storeId linked to this account");

        List<Order> orders;
        if ("ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            orders = orderRepository.findByStoreIdOrderByCreatedAtDesc(storeId);
        } else {
            orders = orderRepository.findByStoreIdAndStatusInOrderByCreatedAtDesc(
                    storeId, Arrays.asList("PENDING", "CONFIRMED", "SHIPPING")
            );
        }
        return ResponseEntity.ok(orders);
    }

    // -----------------------------------------------------------------------
    // STORE: Lấy tất cả đơn của cửa hàng (bao gồm lịch sử DELIVERED/CANCELLED)
    // -----------------------------------------------------------------------
    @GetMapping("/store/all")
    public ResponseEntity<?> getAllStoreOrders(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        if (!"STORE".equalsIgnoreCase(currentUser.getRole()) && !"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        String storeId = currentUser.getStoreId();
        if (storeId == null) return ResponseEntity.badRequest().body("No storeId linked");

        return ResponseEntity.ok(orderRepository.findByStoreIdOrderByCreatedAtDesc(storeId));
    }

    // -----------------------------------------------------------------------
    // STORE: Chuyển trạng thái đơn hàng
    // -----------------------------------------------------------------------
    /**
     * PUT /api/orders/{id}/status
     * Body: { "status": "CONFIRMED" | "SHIPPING" | "DELIVERED" }
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id,
                                           @RequestBody Map<String, String> body,
                                           HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");


        String newStatus = body.get("status");
        if (newStatus == null) return ResponseEntity.badRequest().body("Missing status");

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();

        boolean isUserOwner = order.getUserId().equals(currentUser.getId());
        boolean isStoreOwner = "STORE".equalsIgnoreCase(currentUser.getRole())
                && order.getStoreId().equals(currentUser.getStoreId());
        boolean isAdmin = "ADMIN".equalsIgnoreCase(currentUser.getRole());

        // Nếu mới đổi thành DELIVERED, cho phép User được tự làm
        boolean isUserReceiving = isUserOwner && "DELIVERED".equals(newStatus);

        if (!isStoreOwner && !isAdmin && !isUserReceiving) {
            return ResponseEntity.status(403).body("Forbidden: Cannot update this order's status");
        }

        // Validate chuyển trạng thái hợp lệ
        String currentStatus = order.getStatus();
        boolean validTransition = switch (currentStatus) {
            case "PENDING" -> "CONFIRMED".equals(newStatus) || "SHIPPING".equals(newStatus) || "CANCELLED".equals(newStatus); // Nhảy thẳng SHIPPING từ Store Dashboard
            case "CONFIRMED" -> "SHIPPING".equals(newStatus) || "DELIVERED".equals(newStatus);
            case "SHIPPING" -> "DELIVERED".equals(newStatus);
            default -> false;
        };

        if (!validTransition) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Không thể chuyển từ " + currentStatus + " sang " + newStatus));
        }

        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);

        // --- Notify User ---
        String message = switch (newStatus) {
            case "CONFIRMED" -> "Cửa hàng " + order.getStoreName() + " đã xác nhận đơn hàng #" + id.substring(0, 8) + " của bạn.";
            case "SHIPPING" -> "Đơn hàng #" + id.substring(0, 8) + " đang được giao đến bạn!";
            case "DELIVERED" -> "Đơn hàng #" + id.substring(0, 8) + " đã giao thành công. Cảm ơn bạn!";
            default -> "Trạng thái đơn hàng đã được cập nhật.";
        };

        notificationService.createAndSend(
                order.getUserId(),
                "ORDER",
                order.getStoreName(),
                "",
                message,
                "/tracking/" + id
        );

        // --- DEV WORKAROUND: Auto-progress CONFIRMED to SHIPPING ---
        if ("CONFIRMED".equals(newStatus)) {
            scheduler.schedule(() -> {
                try {
                    Optional<Order> oOpt = orderRepository.findById(id);
                    if (oOpt.isPresent()) {
                        Order o = oOpt.get();
                        if ("CONFIRMED".equals(o.getStatus())) {
                            o.setStatus("SHIPPING");
                            orderRepository.save(o);

                            notificationService.createAndSend(
                                o.getUserId(),
                                "ORDER",
                                o.getStoreName(),
                                "",
                                "Đơn hàng #" + id.substring(0, 8) + " đang được giao đến bạn!",
                                "/tracking/" + id
                            );
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error in auto-shipping task: " + e.getMessage());
                }
            }, 5, TimeUnit.SECONDS);
        }

        return ResponseEntity.ok(saved);
    }

    // -----------------------------------------------------------------------
    // USER: Huỷ đơn hàng (chỉ khi PENDING)
    // -----------------------------------------------------------------------
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String id, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();

        if (!order.getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("Forbidden: Not your order");
        }

        if (!"PENDING".equals(order.getStatus())) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Chỉ có thể huỷ đơn khi đang ở trạng thái Chờ xác nhận"));
        }

        order.setStatus("CANCELLED");
        return ResponseEntity.ok(orderRepository.save(order));
    }
}
