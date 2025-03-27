package com.alten.remotesync.application.project.service;

import com.alten.remotesync.application.project.record.request.ClientIdDTO;
import com.alten.remotesync.application.project.record.request.ProjectIdDTO;
import com.alten.remotesync.application.project.record.request.ProjectLabelDTO;
import com.alten.remotesync.application.project.record.response.ProjectCountDTO;
import com.alten.remotesync.application.project.record.response.ProjectDTO;
import com.alten.remotesync.domain.assignedRotation.repository.AssignedRotationDomainRepository;
import com.alten.remotesync.domain.project.repository.ProjectDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProjectServiceImp implements ProjectService {
    private final ProjectDomainRepository projectDomainRepository;
    private final AssignedRotationDomainRepository assignedRotationDomainRepository;


    @Override
    public List<ProjectDTO> getAssociateProjects() {
        return List.of();
    }

    @Override
    public ProjectDTO getAssociateProjectDetails(ProjectIdDTO projectIdDTO) {
        return null;
    }

    @Override
    public List<ProjectDTO> getAssociateProjectsByLabel(ProjectLabelDTO projectLabelDTO) {
        return List.of();
    }

    @Override
    public ProjectCountDTO getAssociateProjectsCount() {

        return null;
    }

    @Override
    public List<ProjectDTO> getAssociateProjectsByClient(ClientIdDTO clientIdDTO) {
        return List.of();
    }
}
