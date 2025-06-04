package com.alten.remotesync.domain.project.model;

import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.client.model.Client;
import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
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

    private LocalDate deadLine;

    private LocalDate startDate;

    private Boolean isDeleted;

    @ManyToOne
    private Client owner;

    @OneToMany(mappedBy = "project")
    private List<AssignedRotation> projectAssignedRotations;
}
