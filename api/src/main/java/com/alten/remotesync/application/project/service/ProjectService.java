package com.alten.remotesync.application.project.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;

import com.alten.remotesync.application.globalDTO.PagedGlobalIdDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByClientDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByLabelDTO;
import com.alten.remotesync.application.project.record.request.UpdateProjectDTO;
import com.alten.remotesync.application.project.record.response.PagedProjectDTO;
import com.alten.remotesync.application.project.record.response.ProjectsCountDTO;
import com.alten.remotesync.application.project.record.response.ProjectDTO;
import org.springframework.stereotype.Service;

@Service
public interface ProjectService {
    ProjectDTO getAssociateCurrentProject(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateOldProjects(GlobalDTO globalDTO, PagedGlobalIdDTO pagedGlobalIdDTO);

    ProjectDTO getProjectDetails(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateOldProjectsByLabel(GlobalDTO globalDTO,AssociateProjectByLabelDTO associateProjectByLabelDTO);

    ProjectsCountDTO getAssociateProjectsCount(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateProjectsByClient(GlobalDTO globalDTO,AssociateProjectByClientDTO associateProjectByClientDTO);

    ProjectDTO getLongestDurationProject();

    Integer getCompletedProjectsCount();

    ProjectDTO updateProject(UpdateProjectDTO updateProjectDTO);

    ProjectDTO deleteProject(GlobalDTO globalDTO);
}
