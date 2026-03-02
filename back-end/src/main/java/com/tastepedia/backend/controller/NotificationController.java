package com.tastepedia.backend.controller;

import com.tastepedia.backend.model.Notification;
import com.tastepedia.backend.model.User;
import com.tastepedia.backend.service.NotificationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * GET /api/notifications
     * Lấy danh sách tất cả thông báo của user hiện tại (mới nhất trước).
     */
    @GetMapping
    public ResponseEntity<?> getNotifications(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        List<Notification> notifications = notificationService.getNotificationsForUser(currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET /api/notifications/unread-count
     * Đếm số thông báo chưa đọc — dùng cho badge chuông.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body(Map.of("count", 0));

        long count = notificationService.countUnread(currentUser.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * PUT /api/notifications/{id}/read
     * Đánh dấu 1 thông báo là đã đọc.
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id, HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        Notification updated = notificationService.markAsRead(id);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    /**
     * PUT /api/notifications/read-all
     * Đánh dấu TẤT CẢ thông báo là đã đọc.
     */
    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    /**
     * DELETE /api/notifications/clear
     * Xóa toàn bộ thông báo của user hiện tại.
     */
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearAll(HttpSession session) {
        User currentUser = (User) session.getAttribute("MY_SESSION_USER");
        if (currentUser == null) return ResponseEntity.status(401).body("Unauthorized");

        notificationService.clearAll(currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications cleared"));
    }
}
