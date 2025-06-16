package com.alten.remotesync.application.notification.record.response;

import java.util.List;

public record AssociateInitialeNotificationsDTO(
        PagedNotificationDTO notifications,
        Long urgentCount ,
        Long importantCount ,
        Long normalCount
) {
}
