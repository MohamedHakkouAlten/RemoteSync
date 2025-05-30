package com.alten.remotesync.application.notification.record.response;

import com.alten.remotesync.domain.notification.enumeration.NotificationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationDTO(
        UUID notificationId,
        String title,
        String description,
        NotificationStatus status,
        LocalDateTime createdAt
) {
}
