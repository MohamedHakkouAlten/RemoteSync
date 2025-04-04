package com.alten.remotesync.application.assignedRotation.mapper;

import com.alten.remotesync.application.assignedRotation.record.response.AssignedRotationDTO;
import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.rotation.model.Rotation;
import com.alten.remotesync.domain.user.model.User;
import java.time.LocalDateTime;
import java.util.Date;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-03T16:42:18+0000",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.14 (Azul Systems, Inc.)"
)
@Component
public class AssignedRotationMapperImpl implements AssignedRotationMapper {

    @Override
    public AssignedRotationDTO toAssignedRotationDTO(AssignedRotation assignedRotation) {
        if ( assignedRotation == null ) {
            return null;
        }

        User user = null;
        Rotation rotation = null;
        Project project = null;
        RotationAssignmentStatus rotationAssignmentStatus = null;
        Date overrideDate = null;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;
        User createdBy = null;
        User updatedBy = null;

        user = assignedRotation.getUser();
        rotation = assignedRotation.getRotation();
        project = assignedRotation.getProject();
        rotationAssignmentStatus = assignedRotation.getRotationAssignmentStatus();
        overrideDate = assignedRotation.getOverrideDate();
        createdAt = assignedRotation.getCreatedAt();
        updatedAt = assignedRotation.getUpdatedAt();
        createdBy = assignedRotation.getCreatedBy();
        updatedBy = assignedRotation.getUpdatedBy();

        AssignedRotationDTO assignedRotationDTO = new AssignedRotationDTO( user, rotation, project, rotationAssignmentStatus, overrideDate, createdAt, updatedAt, createdBy, updatedBy );

        return assignedRotationDTO;
    }
}
