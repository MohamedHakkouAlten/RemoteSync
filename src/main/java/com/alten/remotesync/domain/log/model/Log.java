package com.alten.remotesync.domain.log.model;

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

    @CreationTimestamp
    private LocalDateTime timestamp;

    private String ipAddress;
    private String actionType;

    @Enumerated(EnumType.STRING)
    private LogStatus status;

    private String userAgent;
    private String entityType;
    private String actionDetails;
    private UUID entityId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
