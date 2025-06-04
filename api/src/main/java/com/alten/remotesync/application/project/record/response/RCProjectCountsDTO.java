package com.alten.remotesync.application.project.record.response;

import java.util.List;

public record RCProjectCountsDTO(
        Long activeProjects ,
        Long totalProjects,
        Long completedProjects,
        Long cancelledProjects,
        Long inActiveProjects,
        List<ProjectDTO> projects
) {
}
