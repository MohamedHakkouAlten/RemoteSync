package com.alten.remotesync.application.user.mapper;

import com.alten.remotesync.application.user.record.response.AssignedRotationDTO;
import com.alten.remotesync.application.user.record.response.UserProfileDTO;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "userAssignedRotations", target = "assignedRotations", qualifiedByName = "mapAssignedRotations")
    UserProfileDTO toUserProfileDTO(User user);

    @Named("mapAssignedRotations")
    default List<AssignedRotationDTO> mapAssignedRotations(List<AssignedRotation> assignedRotations) {
        if (assignedRotations == null) return List.of();
        return assignedRotations.stream()
                .map(this::mapAssignedRotation)
                .collect(Collectors.toList());
    }

    default AssignedRotationDTO mapAssignedRotation(AssignedRotation assignedRotation) {
        return new AssignedRotationDTO(
                assignedRotation.getRotation().getRotationId(),
                assignedRotation.getRotation().getName(),
                assignedRotation.getRotationAssignmentStatus().toString()
        );
    }
}
