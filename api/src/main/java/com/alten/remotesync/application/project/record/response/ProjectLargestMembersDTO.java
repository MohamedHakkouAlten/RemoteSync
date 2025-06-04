package com.alten.remotesync.application.project.record.response;

import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import com.alten.remotesync.domain.project.projection.ProjectMembersProjection;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProjectLargestMembersDTO(
        ProjectDTO projectDTO,
        List<String> usersList,
        Long usersCount
) {

}
