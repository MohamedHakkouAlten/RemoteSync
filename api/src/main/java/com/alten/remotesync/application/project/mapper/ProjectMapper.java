package com.alten.remotesync.application.project.mapper;

import com.alten.remotesync.application.project.record.request.UpdateProjectDTO;
import com.alten.remotesync.application.project.record.response.ProjectDropDownDTO;
import com.alten.remotesync.application.project.record.response.ProjectsCountDTO;
import com.alten.remotesync.application.project.record.response.ProjectDTO;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.project.projection.ProjectProjection;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    ProjectDTO toProjectDTO(Project project);
    ProjectsCountDTO toProjectsCount(Integer projectsCount);
    Project toProject(UpdateProjectDTO updateProjectDTO);
    ProjectDropDownDTO toProjectDropDownDTO(ProjectProjection projectProjection);
}

