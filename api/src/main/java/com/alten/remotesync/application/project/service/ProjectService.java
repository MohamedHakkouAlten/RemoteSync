package com.alten.remotesync.application.project.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;

import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByClientDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByLabelDTO;
import com.alten.remotesync.application.project.record.request.UpdateProjectDTO;
import com.alten.remotesync.application.project.record.response.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProjectService {
    ProjectDTO getAssociateCurrentProject(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateOldProjects(GlobalDTO globalDTO, PagedGlobalDTO pagedGlobalDTO);

    ProjectDTO getProjectDetails(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateOldProjectsByLabel(GlobalDTO globalDTO,AssociateProjectByLabelDTO associateProjectByLabelDTO);

    ProjectsCountDTO getAssociateProjectsCount(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateProjectsByClient(GlobalDTO globalDTO,AssociateProjectByClientDTO associateProjectByClientDTO);

    ProjectDashBoardDTO getLongestDurationProject();
    ProjectLargestMembersDTO getRCLargestMembersProject();

    ProjectsCountDTO getCompletedProjectsCount();

    ProjectDTO updateProject(UpdateProjectDTO updateProjectDTO);

    ProjectDTO deleteProject(GlobalDTO globalDTO);

    ProjectsCountDTO getRcCountInactiveProjects();

    List<ProjectDropDownDTO> getRcProjectsByClient(GlobalDTO globalDTO);

    List<ProjectDropDownDTO> getRcProjectsByLabel(String label);

    PagedProjectDTO getProjects(GlobalDTO globalDTO, PagedGlobalDTO pagedGlobalDTO);

    ProjectsCountDTO countActiveProjects();

    ProjectDTO getLargestTeamProject(GlobalDTO globalDTO);

    ProjectsCountDTO countCancelledProjects();

    PagedProjectDTO searchProjectsByLabel(String label);
}
