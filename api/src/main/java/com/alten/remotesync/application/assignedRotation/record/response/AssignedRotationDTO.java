package com.alten.remotesync.application.assignedRotation.record.response;

import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.rotation.model.Rotation;
import com.alten.remotesync.domain.user.model.User;

import java.time.LocalDateTime;
import java.util.Date;

public record AssignedRotationDTO(
        User user,
        Rotation rotation,
        Project project,
        RotationAssignmentStatus rotationAssignmentStatus,
        Date overrideDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        User createdBy,
        User updatedBy
) {
}
