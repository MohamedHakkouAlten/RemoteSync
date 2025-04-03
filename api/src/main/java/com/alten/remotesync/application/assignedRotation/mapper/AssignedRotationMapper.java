package com.alten.remotesync.application.assignedRotation.mapper;

import com.alten.remotesync.application.assignedRotation.record.response.AssignedRotationDTO;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AssignedRotationMapper {
    AssignedRotationDTO toAssignedRotationDTO(AssignedRotation assignedRotation);
}
