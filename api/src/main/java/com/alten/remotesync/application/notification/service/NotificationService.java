package com.alten.remotesync.application.notification.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.notification.record.request.NotificationByStatusDTO;
import com.alten.remotesync.application.notification.record.request.PagedNotificationSearchDTO;
import com.alten.remotesync.application.notification.record.response.PagedNotificationDTO;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface NotificationService {
    PagedNotificationDTO getAssociateNotifications(PagedNotificationSearchDTO pagedNotificationSearchDTO);
    Long countTotalAssociateNotificationsByStatus(NotificationByStatusDTO notificationByStatusDTO);
    Long countUnreadNotifications(UUID userId);
    void setNotificationAsRead(String notificationId);
    void markAllNotificationAsRead(UUID userId);


}
