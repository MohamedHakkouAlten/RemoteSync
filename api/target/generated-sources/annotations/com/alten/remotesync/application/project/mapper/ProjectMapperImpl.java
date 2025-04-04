package com.alten.remotesync.application.project.mapper;

import com.alten.remotesync.application.project.record.response.ProjectDTO;
import com.alten.remotesync.application.project.record.response.ProjectsCountDTO;
import com.alten.remotesync.domain.client.model.Client;
import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import com.alten.remotesync.domain.project.model.Project;
import java.util.Date;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-03T16:42:09+0000",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.14 (Azul Systems, Inc.)"
)
@Component
public class ProjectMapperImpl implements ProjectMapper {

    @Override
    public ProjectDTO toProjectDTO(Project project) {
        if ( project == null ) {
            return null;
        }

        UUID projectId = null;
        String label = null;
        String titre = null;
        ProjectStatus status = null;
        Date deadLine = null;
        Client owner = null;

        projectId = project.getProjectId();
        label = project.getLabel();
        titre = project.getTitre();
        status = project.getStatus();
        deadLine = project.getDeadLine();
        owner = project.getOwner();

        boolean isDeleted = false;

        ProjectDTO projectDTO = new ProjectDTO( projectId, label, titre, status, deadLine, isDeleted, owner );

        return projectDTO;
    }

    @Override
    public ProjectsCountDTO toProjectsCount(Integer projectsCount) {
        if ( projectsCount == null ) {
            return null;
        }

        int projectsCount1 = 0;

        if ( projectsCount != null ) {
            projectsCount1 = projectsCount;
        }

        ProjectsCountDTO projectsCountDTO = new ProjectsCountDTO( projectsCount1 );

        return projectsCountDTO;
    }
}
