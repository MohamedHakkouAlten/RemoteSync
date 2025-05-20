package com.alten.remotesync.application.project.mapper;

import com.alten.remotesync.application.project.record.request.UpdateProjectDTO;
import com.alten.remotesync.application.project.record.response.*;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.project.projection.ProjectDashBoardProjection;
import com.alten.remotesync.domain.project.projection.ProjectLargestMembersProjection;
import com.alten.remotesync.domain.project.projection.ProjectProjection;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    ProjectDTO toProjectDTO(Project project);
    ProjectsCountDTO toProjectsCount(Integer projectsCount);
    Project toProject(UpdateProjectDTO updateProjectDTO);
    ProjectDropDownDTO toProjectDropDownDTO(ProjectProjection projectProjection);
    ProjectDashBoardDTO toProjectDashBoardDTO(ProjectDashBoardProjection projectDashBoardProjection);

}

