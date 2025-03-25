package com.alten.remotesync.domain.log.model;

import com.alten.remotesync.domain.log.enumeration.LogStatus;
import com.alten.remotesync.domain.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID entityId;

    @CreationTimestamp
    private LocalDateTime timestamp;

    private String ipAddress;
    private String actionType;

    @Enumerated(EnumType.STRING)
    private LogStatus status;

    private String userAgent;
    private String entityType;
    private String actionDetails;

    @ManyToOne
    private User user;
}
