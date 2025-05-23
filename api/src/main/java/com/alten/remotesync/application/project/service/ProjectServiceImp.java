package com.alten.remotesync.application.project.service;

import com.alten.remotesync.adapter.exception.client.ClientNotFoundException;
import com.alten.remotesync.adapter.exception.project.ProjectNotFoundException;
import com.alten.remotesync.adapter.exception.user.UserNotFoundException;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;

import com.alten.remotesync.application.project.mapper.ProjectMapper;
import com.alten.remotesync.application.project.record.request.AssociateProjectByClientDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByLabelDTO;
import com.alten.remotesync.application.project.record.request.UpdateProjectDTO;
import com.alten.remotesync.application.project.record.response.*;
import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.project.projection.ProjectDashBoardProjection;
import com.alten.remotesync.domain.project.projection.ProjectLargestMembersProjection;
import com.alten.remotesync.domain.project.projection.ProjectMembersProjection;
import com.alten.remotesync.domain.project.repository.ProjectDomainRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class ProjectServiceImp implements ProjectService {
    private final ProjectDomainRepository projectDomainRepository;
    private final ProjectMapper projectMapper;

    @Override
    public ProjectDTO getAssociateCurrentProject(GlobalDTO globalDTO) {
        Project project = projectDomainRepository.fetchAssociateCurrentProject(globalDTO.userId()).orElseThrow(() -> new ProjectNotFoundException("No projects are associated with this user"));
        return projectMapper.toProjectDTO(project);
    }

    @Override
    public PagedProjectDTO getAssociateOldProjects(GlobalDTO globalDTO, PagedGlobalDTO pagedGlobalDTO) {
        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjects(
                        globalDTO.userId(),
                        PageRequest.of(pagedGlobalDTO.pageNumber(),
                                (pagedGlobalDTO.pageSize() != null) ? pagedGlobalDTO.pageSize() : 10))
                .orElseThrow(()->new UserNotFoundException("user not found"));

        return new PagedProjectDTO(pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                pagedGlobalDTO.pageNumber() + 1,
                pagedGlobalDTO.pageSize()
        );
    }

    @Override
    public ProjectDTO getProjectDetails(GlobalDTO globalDTO) {
        Project project = projectDomainRepository.findById(globalDTO.projectId())
                .orElseThrow(()->new ProjectNotFoundException("Project Not found"));
        return projectMapper.toProjectDTO(project);

    }

    @Override
    public PagedProjectDTO getAssociateOldProjectsByLabel(GlobalDTO globalDTO,AssociateProjectByLabelDTO associateProjectByLabelDTO) {

        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjectsByLabel
                        (globalDTO.userId(),
                                associateProjectByLabelDTO.label(),
                                PageRequest.of(associateProjectByLabelDTO.pageNumber(),
                                        (associateProjectByLabelDTO.pageSize() != null) ? associateProjectByLabelDTO.pageSize() : 10))
                .orElseThrow(()->new UserNotFoundException("user not found"));

        return new PagedProjectDTO(pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                associateProjectByLabelDTO.pageNumber() + 1,
                associateProjectByLabelDTO.pageSize()
        );
    }

    @Override
    public ProjectsCountDTO getAssociateProjectsCount(GlobalDTO globalDTO) {

        return projectMapper.toProjectsCount(projectDomainRepository.fetchAssociateProjectsCount(globalDTO.userId())
                        .orElseThrow(()->new UserNotFoundException("user not found"))
        );
    }

    @Override
    public PagedProjectDTO getAssociateProjectsByClient(GlobalDTO globalDTO,AssociateProjectByClientDTO associateProjectByClientDTO) {

        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjectsByClient(
                        globalDTO.userId(),
                       associateProjectByClientDTO.clientId(),
                        PageRequest.of(associateProjectByClientDTO.pageNumber(),
                                (associateProjectByClientDTO.pageSize() != null) ? associateProjectByClientDTO.pageSize() : 10))
                .orElseThrow(()->new UserNotFoundException("user not found"));

        return new PagedProjectDTO(pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                associateProjectByClientDTO.pageNumber() + 1,
               associateProjectByClientDTO.pageSize()
        );
    }

    @Override
    public ProjectDashBoardDTO getLongestDurationProject() {


        return projectMapper.toProjectDashBoardDTO(projectDomainRepository.findLongestDurationProject()
                .orElseThrow(() -> new ProjectNotFoundException("No projects exist")));
    }

    @Override
    @Transactional
    public ProjectLargestMembersDTO getRCLargestMembersProject() {
        ProjectLargestMembersProjection largestMembersProjection=projectDomainRepository.fetchRCProjectWithLargestTeam().orElseThrow(()->new ProjectNotFoundException("no project was found"));
        System.out.println(largestMembersProjection.getProjectId()+"v"+largestMembersProjection.getUsersCount());
        List<String> membersProjections=projectDomainRepository.findFirst5UsersByProject(largestMembersProjection.getProjectId()).orElseThrow(()->new ProjectNotFoundException("project not found")).stream().map(ProjectMembersProjection::getInitials).toList();
        return new ProjectLargestMembersDTO(largestMembersProjection.getProjectId(), largestMembersProjection.getLabel(), largestMembersProjection.getTitre(),
                largestMembersProjection.getStatus(),largestMembersProjection.getDeadLine(),largestMembersProjection.getStartDate(),
                membersProjections, largestMembersProjection.getUsersCount());

    }

    @Override
    public ProjectsCountDTO getCompletedProjectsCount() {

        return projectMapper.toProjectsCount(projectDomainRepository.countDistinctByStatusEquals(ProjectStatus.COMPLETED));
    }


    @Override
    public ProjectDTO updateProject(UpdateProjectDTO updateProjectDTO) {

        Project project = projectMapper.toProject(updateProjectDTO);
        Project dbProject = projectDomainRepository.findById(project.getProjectId()).orElseThrow(() -> new ProjectNotFoundException("project doesn't exist"));
        project.setIsDeleted(dbProject.getIsDeleted());
        project.setOwner(dbProject.getOwner());
        projectDomainRepository.save(project);
        return projectMapper.toProjectDTO(project);
    }

    @Override
    public ProjectsCountDTO getRcCountInactiveProjects() {
        return projectMapper.toProjectsCount(projectDomainRepository.countDistinctByStatusEquals(ProjectStatus.INACTIVE));
    }

    @Override
    public List<ProjectDropDownDTO> getRcProjectsByClient(GlobalDTO globalDTO) {
        return projectDomainRepository.findAllByOwner_ClientId(globalDTO.clientId()).orElseThrow(() -> new ClientNotFoundException("Client not found")).stream().map(projectMapper::toProjectDropDownDTO).toList();
    }

    @Override
    public List<ProjectDropDownDTO> getRcProjectsByLabel(String label) {
        if(label.isBlank()) return projectDomainRepository.findAllBy(PageRequest.of(0,10)).orElseThrow(() -> new ProjectNotFoundException("No projects exist")).stream().map(projectMapper::toProjectDropDownDTO).toList();
        return projectDomainRepository.findTop10ByLabelContainsIgnoreCase(label).orElseThrow(() -> new ProjectNotFoundException("No projects exist")).stream().map(projectMapper::toProjectDropDownDTO).toList();
    }


    @Override
    public ProjectDTO deleteProject(GlobalDTO globalDTO) {

        Project project=projectDomainRepository.findById(globalDTO.projectId()).orElseThrow(() -> new ProjectNotFoundException("project doesn't exist"));
        project.setIsDeleted(true);
        projectDomainRepository.save(project);
        return projectMapper.toProjectDTO(project);
    }

    @Override
    public PagedProjectDTO getProjects(GlobalDTO globalDTO, PagedGlobalDTO pagedGlobalDTO) {
        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateProjects(
                        globalDTO.userId(),
                        PageRequest.of(pagedGlobalDTO.pageNumber(),
                                pagedGlobalDTO.pageSize() != null ? pagedGlobalDTO.pageSize() : 10))
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return new PagedProjectDTO(
                pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                pagedGlobalDTO.pageNumber() + 1,
                pagedGlobalDTO.pageSize()
        );
    }

    @Override
    public ProjectsCountDTO countActiveProjects() {
        return projectMapper.toProjectsCount(projectDomainRepository.countDistinctByStatusEquals(ProjectStatus.ACTIVE));
    }
    @Override
    public ProjectsCountDTO countCancelledProjects() {
        return projectMapper.toProjectsCount(projectDomainRepository.countDistinctByStatusEquals(ProjectStatus.CANCELLED));
    }

    @Override
    public PagedProjectDTO searchProjectsByLabel(String label) {
        return null;
    }

    @Override
    public ProjectDTO getLargestTeamProject(GlobalDTO globalDTO) {
        Project project = projectDomainRepository
                .fetchProjectWithLargestTeam(globalDTO.userId())
                .orElseThrow(() -> new ProjectNotFoundException("No project with a large team found"));
        return projectMapper.toProjectDTO(project);
    }
}
