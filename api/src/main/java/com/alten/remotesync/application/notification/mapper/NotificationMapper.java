package com.alten.remotesync.application.notification.mapper;

import com.alten.remotesync.application.notification.record.response.NotificationDTO;
import com.alten.remotesync.domain.notification.model.Notification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    NotificationDTO toNotificationDTO(Notification notification);
}
