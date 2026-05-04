package com.app.instagram.service;

import com.app.instagram.dto.response.NotificationResponse;
import com.app.instagram.entity.Notification;
import com.app.instagram.entity.User;
import com.app.instagram.enums.NotificationType;
import com.app.instagram.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public void createNotification(User recipient, User actor,
                                   NotificationType type, Long referenceId, String message) {
        Notification notification = Notification.builder()
                .user(recipient)
                .actor(actor)
                .type(type)
                .referenceId(referenceId)
                .message(message)
                .build();
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(n -> mapToNotificationResponse(n, userId)).toList();
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    private NotificationResponse mapToNotificationResponse(Notification n, Long currentUserId) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .message(n.getMessage())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .actor(n.getActor() != null ? userService.mapToUserResponse(n.getActor(), currentUserId) : null)
                .referenceId(n.getReferenceId())
                .build();
    }
}
