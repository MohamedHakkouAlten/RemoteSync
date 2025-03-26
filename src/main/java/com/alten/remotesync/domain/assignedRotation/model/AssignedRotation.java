package com.alten.remotesync.domain.assignedRotation.model;

import com.alten.remotesync.domain.assignedRotation.model.embeddable.AssignedRotationId;
import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.rotation.model.Rotation;
import com.alten.remotesync.domain.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssignedRotation {
    @EmbeddedId
    private AssignedRotationId assignedRotationId;

    @ManyToOne
    @MapsId("userId")
    private User user;

    @ManyToOne
    @MapsId("rotationId")
    private Rotation rotation;

    @ManyToOne
    @MapsId("projectId")
    private Project project;

    @Enumerated(EnumType.STRING)
    private RotationAssignmentStatus rotationAssignmentStatus;

    private Date overrideDate;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    private User createdBy;

    @ManyToOne
    private User updatedBy;
}
