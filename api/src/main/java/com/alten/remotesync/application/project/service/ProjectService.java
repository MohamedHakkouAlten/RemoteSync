package com.alten.remotesync.application.project.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;

import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByClientDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByLabelDTO;
import com.alten.remotesync.application.project.record.request.PagedProjectSearchDTO;
import com.alten.remotesync.application.project.record.request.UpdateProjectDTO;
import com.alten.remotesync.application.project.record.response.*;
import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import org.springframework.stereotype.Service;

import java.util.List;

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

    PagedProjectDTO getProjects(GlobalDTO globalDTO, PagedGlobalDTO pagedGlobalIdDTO);

    RcProjectsCountDTO countActiveProjects();

    //ProjectDTO getLargestTeamProject();

    RcProjectsCountDTO countCancelledProjects();

    RcProjectsCountDTO getRcCountProjectByStatus(ProjectStatus projectStatus);

    //RcCompletedProjectsCountDTO getRcCompletedProjectsCount();

    ProjectDTO getRcLongestDurationProject();

    ProjectDTO getRcLargestTeamProject();
    List<ProjectDropDownDTO> getRcAllProjectsByClient(GlobalDTO globalDTO);

    List<ProjectDropDownDTO> getRcAllProjects();
}
