package com.alten.remotesync.application.notification.record.response;

public record AssociatePanelNotificationsDTO(
        PagedNotificationDTO notifications,
        Long countUnreadNotifications
) {
}
