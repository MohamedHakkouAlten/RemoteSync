package com.alten.remotesync.application.project.service;

import com.alten.remotesync.adapter.exception.project.ProjectNotFoundException;
import com.alten.remotesync.adapter.exception.user.UserNotFoundException;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalIdDTO;
import com.alten.remotesync.application.project.mapper.ProjectMapper;
import com.alten.remotesync.application.project.record.request.AssociateProjectByClientDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByLabelDTO;
import com.alten.remotesync.application.project.record.request.UpdateProjectDTO;
import com.alten.remotesync.application.project.record.response.PagedProjectDTO;
import com.alten.remotesync.application.project.record.response.ProjectsCountDTO;
import com.alten.remotesync.application.project.record.response.ProjectDTO;
import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.project.repository.ProjectDomainRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

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
    public PagedProjectDTO getAssociateOldProjects(GlobalDTO globalDTO, PagedGlobalIdDTO pagedGlobalIdDTO) {
        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjects(
                        globalDTO.userId(),
                        PageRequest.of(pagedGlobalIdDTO.pageNumber(),
                                (pagedGlobalIdDTO.pageSize() != null) ? pagedGlobalIdDTO.pageSize() : 10))
                .orElseThrow(() -> new UserNotFoundException("user not found"));

        return new PagedProjectDTO(pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                pagedGlobalIdDTO.pageNumber() + 1,
                pagedGlobalIdDTO.pageSize()
        );
    }

    @Override
    public ProjectDTO getProjectDetails(GlobalDTO globalDTO) {
        Project project = projectDomainRepository.findById(globalDTO.projectId())
                .orElseThrow(() -> new ProjectNotFoundException("Project Not found"));
        return projectMapper.toProjectDTO(project);

    }

    @Override
    public PagedProjectDTO getAssociateOldProjectsByLabel(GlobalDTO globalDTO, AssociateProjectByLabelDTO associateProjectByLabelDTO) {

        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjectsByLabel
                        (globalDTO.userId(),
                                associateProjectByLabelDTO.label(),
                                PageRequest.of(associateProjectByLabelDTO.pageNumber(),
                                        (associateProjectByLabelDTO.pageSize() != null) ? associateProjectByLabelDTO.pageSize() : 10))
                .orElseThrow(() -> new UserNotFoundException("user not found"));

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
                .orElseThrow(() -> new UserNotFoundException("user not found"))
        );
    }

    @Override
    public PagedProjectDTO getAssociateProjectsByClient(GlobalDTO globalDTO, AssociateProjectByClientDTO associateProjectByClientDTO) {

        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjectsByClient(
                        globalDTO.userId(),
                        associateProjectByClientDTO.clientId(),
                        PageRequest.of(associateProjectByClientDTO.pageNumber(),
                                (associateProjectByClientDTO.pageSize() != null) ? associateProjectByClientDTO.pageSize() : 10))
                .orElseThrow(() -> new UserNotFoundException("user not found"));

        return new PagedProjectDTO(pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                associateProjectByClientDTO.pageNumber() + 1,
                associateProjectByClientDTO.pageSize()
        );
    }

    @Override
    public ProjectDTO getLongestDurationProject() {

        Project project = projectDomainRepository.findLongestDurationProject().orElseThrow(() -> new ProjectNotFoundException("No projects exist"));
        return projectMapper.toProjectDTO(project);
    }

    @Override
    public Integer getCompletedProjectsCount() {

        return projectDomainRepository.countByStatusEquals(ProjectStatus.COMPLETED).orElseThrow();
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
    public ProjectDTO deleteProject(GlobalDTO globalDTO) {

        Project project=projectDomainRepository.findById(globalDTO.projectId()).orElseThrow(()->new ProjectNotFoundException("project doesn't exist"));
        project.setIsDeleted(true);
        projectDomainRepository.save(project);
        return projectMapper.toProjectDTO(project);
    }


}
