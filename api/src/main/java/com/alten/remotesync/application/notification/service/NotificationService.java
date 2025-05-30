package com.alten.remotesync.application.notification.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.notification.record.request.PagedNotificationSearchDTO;
import com.alten.remotesync.application.notification.record.response.PagedNotificationDTO;
import org.springframework.stereotype.Service;

@Service
public interface NotificationService {
    PagedNotificationDTO getAssociateNotifications(PagedNotificationSearchDTO pagedNotificationSearchDTO);
}
