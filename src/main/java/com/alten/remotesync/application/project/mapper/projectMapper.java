package com.alten.remotesync.application.project.mapper;


import com.alten.remotesync.application.project.record.response.ProjectDTO;
import com.alten.remotesync.domain.project.model.Project;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface projectMapper {
    ProjectDTO toProjectDTO(Project project);
}

