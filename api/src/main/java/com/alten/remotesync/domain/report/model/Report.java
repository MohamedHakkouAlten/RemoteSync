package com.alten.remotesync.domain.report.model;

import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import com.alten.remotesync.domain.report.enumeration.ReportType;
import com.alten.remotesync.domain.user.model.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Report {
    @Id
    @UuidGenerator
    private UUID reportId;

    private String title;
    private String reason;

    @Enumerated(EnumType.STRING)
    private ReportType type;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    @CreatedBy
    @JsonBackReference
    private User createdBy;

    @ManyToOne
    @LastModifiedBy
    @JsonBackReference
    private User updatedBy;
}
