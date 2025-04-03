package com.alten.remotesync.domain.notification.model;

import com.alten.remotesync.domain.notification.enumeration.NotificationStatus;
import com.alten.remotesync.domain.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @UuidGenerator
    private UUID id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private NotificationStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    private User receiver;
}
