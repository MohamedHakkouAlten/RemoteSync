package com.alten.remotesync.domain.notification.model;

import com.alten.remotesync.domain.notification.enumeration.NotificationStatus;
import com.alten.remotesync.domain.user.model.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
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
    private UUID notificationId;

    private String title;
    private String description;

    private Boolean isRead;

    @Enumerated(EnumType.STRING)
    private NotificationStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JsonBackReference
    private User receiver;
}
