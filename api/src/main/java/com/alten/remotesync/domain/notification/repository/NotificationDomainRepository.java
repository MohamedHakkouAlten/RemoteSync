package com.alten.remotesync.domain.notification.repository;

import com.alten.remotesync.domain.notification.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationDomainRepository extends JpaRepository<Notification, UUID>, JpaSpecificationExecutor<Notification> {
    Optional<Page<Notification>> findAllByReceiver_UserId(UUID receiverUserId, Pageable pageable);

    List<Notification> findAllByIsRead(boolean isRead);
}
