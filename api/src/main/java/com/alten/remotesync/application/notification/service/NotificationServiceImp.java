package com.alten.remotesync.application.notification.service;

import com.alten.remotesync.domain.notification.repository.NotificationDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationServiceImp implements NotificationService {
    private final NotificationDomainRepository notificationDomainRepository;
}
