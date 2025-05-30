package com.alten.remotesync.application.notification.record.response;

import java.util.List;

public record PagedNotificationDTO(
        List<NotificationDTO> notificationDTOs,
        Integer totalPages,
        Long totalElements,
        Integer currentPage,
        Integer pageSize
) {
}
