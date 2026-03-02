package com.tastepedia.backend.service;

import com.tastepedia.backend.model.Notification;
import com.tastepedia.backend.model.Order;
import com.tastepedia.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Tạo thông báo mới, lưu vào DB và đẩy real-time qua WebSocket đến user.
     */
    public void createAndSend(String recipientUserId, String type,
                               String actorName, String actorAvatar,
                               String message, String link) {
        Notification notification = new Notification();
        notification.setRecipientUserId(recipientUserId);
        notification.setType(type);
        notification.setActorName(actorName);
        notification.setActorAvatar(actorAvatar != null ? actorAvatar : "");
        notification.setMessage(message);
        notification.setLink(link);

        Notification saved = notificationRepository.save(notification);

        messagingTemplate.convertAndSend(
                "/topic/notifications/" + recipientUserId,
                saved
        );
    }

    /**
     * Đẩy đơn hàng mới đến Store Dashboard qua WebSocket.
     * Frontend Store subscribe: /topic/store/{storeId}/new-order
     */
    public void pushNewOrderToStore(String storeId, Order order) {
        messagingTemplate.convertAndSend(
                "/topic/store/" + storeId + "/new-order",
                order
        );
    }

    // --- Các method hỗ trợ NotificationController ---

    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
    }

    public long countUnread(String userId) {
        return notificationRepository.countByRecipientUserIdAndIsReadFalse(userId);
    }

    public Notification markAsRead(String notificationId) {
        return notificationRepository.findById(notificationId).map(n -> {
            n.setRead(true);
            return notificationRepository.save(n);
        }).orElse(null);
    }

    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void clearAll(String userId) {
        notificationRepository.deleteByRecipientUserId(userId);
    }
}
