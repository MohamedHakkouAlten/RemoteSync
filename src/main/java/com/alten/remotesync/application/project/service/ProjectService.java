package com.alten.remotesync.application.project.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalIdDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByLabelDTO;
import com.alten.remotesync.application.project.record.response.PagedProjectDTO;
import com.alten.remotesync.application.project.record.response.ProjectsCountDTO;
import com.alten.remotesync.application.project.record.response.ProjectDTO;
import org.springframework.stereotype.Service;


@Service
public interface ProjectService {

    PagedProjectDTO getAssociateOldProjects(PagedGlobalIdDTO pagedGlobalIdDTO);

    ProjectDTO getProjectDetails(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateOldProjectsByLabel(AssociateProjectByLabelDTO associateProjectByLabelDTO);

    ProjectsCountDTO getAssociateProjectsCount(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateProjectsByClient(PagedGlobalIdDTO pagedGlobalIdDTO);
}
