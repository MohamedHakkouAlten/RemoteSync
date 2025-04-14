package com.alten.remotesync.application.project.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalIdDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByClientDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByLabelDTO;
import com.alten.remotesync.application.project.record.response.PagedProjectDTO;
import com.alten.remotesync.application.project.record.response.ProjectsCountDTO;
import com.alten.remotesync.application.project.record.response.ProjectDTO;
import org.springframework.stereotype.Service;

@Service
public interface ProjectService {
    ProjectDTO getAssociateCurrentProject(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateOldProjects(GlobalDTO globalDTO,PagedGlobalIdDTO pagedGlobalIdDTO);

    ProjectDTO getProjectDetails(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateOldProjectsByLabel(GlobalDTO globalDTO,AssociateProjectByLabelDTO associateProjectByLabelDTO);

    ProjectsCountDTO getAssociateProjectsCount(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateProjectsByClient(GlobalDTO globalDTO,AssociateProjectByClientDTO associateProjectByClientDTO);

    PagedProjectDTO getProjects(GlobalDTO globalDTO, PagedGlobalIdDTO pagedGlobalIdDTO);

    ProjectsCountDTO countActiveProjects(GlobalDTO globalDTO);

    ProjectDTO getLargestTeamProject(GlobalDTO globalDTO);

    ProjectsCountDTO countCancelledProjects(GlobalDTO globalDTO);


}
