package com.alten.remotesync.application.notification.record.request;

import com.alten.remotesync.domain.notification.enumeration.NotificationStatus;

import java.time.LocalDate;
import java.util.UUID;

public record PagedNotificationSearchDTO(
        Integer pageNumber,
        Integer pageSize,
        String title,
        NotificationStatus status,
        LocalDate createdAt,
        UUID userId // set manually in controller
) {
}
