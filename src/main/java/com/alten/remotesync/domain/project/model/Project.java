package com.alten.remotesync.domain.project.model;

import com.alten.remotesync.domain.client.model.Client;
import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import com.alten.remotesync.domain.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Project {
    @Id
    @UuidGenerator
    private UUID projectId;

    private String label;
    private String titre;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    private Date deadLine;

    private boolean isDeleted;

    @ManyToOne
    private Client owner;
}
