package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.Order;
import com.tastepedia.backend.model.Store;
import com.tastepedia.backend.model.User;
import com.tastepedia.backend.model.StoreProduct;
import com.tastepedia.backend.repository.OrderRepository;
import com.tastepedia.backend.repository.StoreProductRepository;
import com.tastepedia.backend.repository.StoreRepository;
import com.tastepedia.backend.service.NotificationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private StoreProductRepository storeProductRepository;

    @Autowired
    private NotificationService notificationService;

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

        // Gán thông tin user từ session (đã được load từ DB)
        order.setUserId(currentUser.getId());
        order.setUserFullName(currentUser.getFullName());
        // Luôn lấy SĐT và địa chỉ từ DB, không tin tưởng payload từ client
        order.setUserPhone(currentUser.getPhone() != null ? currentUser.getPhone() : "Chưa cung cấp");
        order.setUserAddress(currentUser.getAddress() != null ? currentUser.getAddress() : "Chưa cung cấp địa chỉ");
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

        if (!"STORE".equalsIgnoreCase(currentUser.getRole()) && !"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(403).body("Forbidden: Store only");
        }

        String newStatus = body.get("status");
        if (newStatus == null) return ResponseEntity.badRequest().body("Missing status");

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();

        // Validate store ownership
        boolean isStoreOwner = "STORE".equalsIgnoreCase(currentUser.getRole())
                && order.getStoreId().equals(currentUser.getStoreId());
        boolean isAdmin = "ADMIN".equalsIgnoreCase(currentUser.getRole());
        if (!isStoreOwner && !isAdmin) {
            return ResponseEntity.status(403).body("Forbidden: Not your store's order");
        }

        // Validate chuyển trạng thái hợp lệ
        String currentStatus = order.getStatus();
        boolean validTransition = switch (currentStatus) {
            case "PENDING" -> "CONFIRMED".equals(newStatus) || "CANCELLED".equals(newStatus);
            case "CONFIRMED" -> "SHIPPING".equals(newStatus);
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
