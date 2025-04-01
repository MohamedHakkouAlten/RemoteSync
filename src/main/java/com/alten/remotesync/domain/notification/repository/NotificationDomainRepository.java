package com.alten.remotesync.domain.notification.repository;

import com.alten.remotesync.domain.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotificationDomainRepository extends JpaRepository<Notification, UUID> {
}
