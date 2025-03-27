package com.alten.remotesync.application.project.service;

import com.alten.remotesync.application.project.record.request.ClientIdDTO;
import com.alten.remotesync.application.project.record.request.ProjectIdDTO;
import com.alten.remotesync.application.project.record.request.ProjectLabelDTO;
import com.alten.remotesync.application.project.record.response.ProjectCountDTO;
import com.alten.remotesync.application.project.record.response.ProjectDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProjectService {

    List<ProjectDTO> getAssociateProjects();

    ProjectDTO getAssociateProjectDetails(ProjectIdDTO projectIdDTO);

    List<ProjectDTO> getAssociateProjectsByLabel(ProjectLabelDTO projectLabelDTO);

    ProjectCountDTO getAssociateProjectsCount();

    List<ProjectDTO> getAssociateProjectsByClient(ClientIdDTO clientIdDTO);
}
