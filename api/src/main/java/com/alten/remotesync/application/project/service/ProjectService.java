package com.alten.remotesync.application.project.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;

import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
import com.alten.remotesync.application.project.record.request.*;
import com.alten.remotesync.application.project.record.response.*;
import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ProjectService {
    ProjectDTO getAssociateCurrentProject(GlobalDTO globalDTO);

    PagedProjectDTO getAssociateOldProjects(GlobalDTO globalDTO, PagedProjectSearchDTO pagedProjectSearchDTO);

//    ProjectDTO getProjectDetails(GlobalDTO globalDTO);
//
//    PagedProjectDTO getAssociateOldProjectsByLabel(GlobalDTO globalDTO,AssociateProjectByLabelDTO associateProjectByLabelDTO);

    RcProjectsCountDTO getAssociateProjectsCount(GlobalDTO globalDTO);

//    PagedProjectDTO getAssociateProjectsByClient(GlobalDTO globalDTO,AssociateProjectByClientDTO associateProjectByClientDTO);
//
//    ProjectDashBoardDTO getLongestDurationProject();
//
//    RcProjectsCountDTO getCompletedProjectsCount();
//
//    ProjectDTO updateProject(UpdateProjectDTO updateProjectDTO);
//
//    ProjectDTO deleteProject(GlobalDTO globalDTO);
//
//    RcProjectsCountDTO getRcCountInactiveProjects();
//
//    List<ProjectDropDownDTO> getRcProjectsByClient(GlobalDTO globalDTO);

//    List<ProjectDropDownDTO> getRcProjectsByLabel(String label);
    ProjectDTO updateProject(UpdateProjectDTO updateProjectDTO);
    ProjectDTO addProject(AddProjectDTO addProjectDTO);

    ProjectDTO deleteProject(UUID projectId);
    PagedProjectDTO getRCFilteredProjects(ProjectFilterDTO projectFilterDTO);
    PagedProjectDTO getProjects(GlobalDTO globalDTO, PagedGlobalDTO pagedGlobalIdDTO);

    RcProjectsCountDTO countActiveProjects();
    List<ProjectDTO> getInitialRCProjects( );

    RcProjectsCountDTO countTotalProjects();
    //ProjectDTO getLargestTeamProject();
    RcProjectsCountDTO getCompletedProjectsCount();

    RcProjectsCountDTO getRcCountInactiveProjects();
    RcProjectsCountDTO countCancelledProjects();

    PagedProjectDTO getRCProjects( PagedGlobalDTO pagedGlobalDTO);
    RcProjectsCountDTO getRcCountProjectByStatus(ProjectStatus projectStatus);

    //RcCompletedProjectsCountDTO getRcCompletedProjectsCount();

    ProjectDTO getRcLongestDurationProject();

    ProjectLargestMembersDTO getRcLargestTeamProject();
    List<ProjectDropDownDTO> getRcAllProjectsByClient(GlobalDTO globalDTO);

    List<ProjectDropDownDTO> getRcAllProjects();
}
