package com.alten.remotesync.application.notification.record.request;

import com.alten.remotesync.domain.notification.enumeration.NotificationStatus;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record NotificationByStatusDTO(
        @NotNull
        UUID userId,


        List<NotificationStatus> notificationStatus

) {
}
