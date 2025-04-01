package com.alten.remotesync.application.project.service;

import com.alten.remotesync.adapter.exception.project.ProjectNotFoundException;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalIdDTO;
import com.alten.remotesync.application.project.mapper.ProjectMapper;
import com.alten.remotesync.application.project.record.request.AssociateProjectByLabelDTO;
import com.alten.remotesync.application.project.record.response.PagedProjectDTO;
import com.alten.remotesync.application.project.record.response.ProjectsCountDTO;
import com.alten.remotesync.application.project.record.response.ProjectDTO;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.project.repository.ProjectDomainRepository;

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
        Project project = projectDomainRepository.fetchAssociateCurrentProject(globalDTO.userId()).orElseThrow(() -> new ProjectNotFoundException("Project not found"));
        return projectMapper.toProjectDTO(project);
    }

    @Override
    public PagedProjectDTO getAssociateOldProjects(PagedGlobalIdDTO pagedGlobalIdDTO) {
        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjects(
                        pagedGlobalIdDTO.globalDTO().userId(),
                        PageRequest.of(pagedGlobalIdDTO.pageNumber(),
                                (pagedGlobalIdDTO.pageSize() != null) ? pagedGlobalIdDTO.pageSize() : 10))
                .orElseThrow();

        return new PagedProjectDTO(pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                pagedGlobalIdDTO.pageNumber() + 1,
                pagedGlobalIdDTO.pageSize()
        );
    }

    @Override
    public ProjectDTO getProjectDetails(GlobalDTO globalDTO) {
        Project project = projectDomainRepository.findById(globalDTO.projectId()).orElseThrow();
        return projectMapper.toProjectDTO(project);

    }

    @Override
    public PagedProjectDTO getAssociateOldProjectsByLabel(AssociateProjectByLabelDTO associateProjectByLabelDTO) {

        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjectsByLabel
                        (associateProjectByLabelDTO.userId(),
                                associateProjectByLabelDTO.label(),
                                PageRequest.of(associateProjectByLabelDTO.pageNumber(),
                                        (associateProjectByLabelDTO.pageSize() != null) ? associateProjectByLabelDTO.pageSize() : 10))
                .orElseThrow();

        return new PagedProjectDTO(pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                associateProjectByLabelDTO.pageNumber() + 1,
                associateProjectByLabelDTO.pageSize()
        );
    }

    @Override
    public ProjectsCountDTO getAssociateProjectsCount(GlobalDTO globalDTO) {

        return projectMapper.toProjectsCount(projectDomainRepository.fetchAssociateProjectsCount(globalDTO.userId()).orElseThrow()
        );
    }

    @Override
    public PagedProjectDTO getAssociateProjectsByClient(PagedGlobalIdDTO pagedGlobalIdDTO) {

        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjectsByClient(
                        pagedGlobalIdDTO.globalDTO().userId(),
                        pagedGlobalIdDTO.globalDTO().clientId(),
                        PageRequest.of(pagedGlobalIdDTO.pageNumber(),
                                (pagedGlobalIdDTO.pageSize() != null) ? pagedGlobalIdDTO.pageSize() : 10))
                .orElseThrow();

        return new PagedProjectDTO(pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                pagedGlobalIdDTO.pageNumber() + 1,
                pagedGlobalIdDTO.pageSize()
        );
    }

}
