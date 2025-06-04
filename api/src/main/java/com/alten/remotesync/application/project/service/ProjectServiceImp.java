package com.alten.remotesync.application.project.service;

import com.alten.remotesync.adapter.exception.client.ClientNotFoundException;
import com.alten.remotesync.adapter.exception.project.ProjectNotFoundException;
import com.alten.remotesync.adapter.exception.user.UserNotFoundException;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;

import com.alten.remotesync.application.project.mapper.ProjectMapper;
import com.alten.remotesync.application.project.record.request.*;
import com.alten.remotesync.application.project.record.response.*;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.assignedRotation.repository.AssignedRotationDomainRepository;
import com.alten.remotesync.domain.client.model.Client;
import com.alten.remotesync.domain.client.repository.ClientDomainRepository;
import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.project.projection.ProjectLargestMembersProjection;
import com.alten.remotesync.domain.project.projection.ProjectMembersProjection;
import com.alten.remotesync.domain.project.repository.ProjectDomainRepository;

import com.alten.remotesync.domain.user.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ProjectServiceImp implements ProjectService {
    private final ProjectDomainRepository projectDomainRepository;
    private final AssignedRotationDomainRepository assignedRotationDomainRepository;
    private final ProjectMapper projectMapper;
    private final EntityManager entityManager;
    private final ClientDomainRepository clientDomainRepository;

    @Override
    public ProjectDTO getAssociateCurrentProject(GlobalDTO globalDTO) {
        Project project = projectDomainRepository.fetchAssociateCurrentProject(globalDTO.userId()).orElseThrow(() -> new ProjectNotFoundException("No projects are associated with this user"));
        return projectMapper.toProjectDTO(project);
    }

    @Override
    public PagedProjectDTO getAssociateOldProjects(GlobalDTO globalDTO, PagedProjectSearchDTO pagedProjectSearchDTO) {
        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjectsFiltered(
                globalDTO.userId(),
                pagedProjectSearchDTO.label(),
                pagedProjectSearchDTO.status(),
                pagedProjectSearchDTO.clientId(),
                PageRequest.of(pagedProjectSearchDTO.pageNumber(),
                        (pagedProjectSearchDTO.pageSize() != null) ? pagedProjectSearchDTO.pageSize() : 10)).orElseThrow(() -> new UserNotFoundException("user not found"));

        return new PagedProjectDTO(pagedProjects.stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                pagedProjectSearchDTO.pageNumber() + 1,
                pagedProjectSearchDTO.pageSize()
        );
    }
//
//    @Override
//    public ProjectDTO getProjectDetails(GlobalDTO globalDTO) {
//        Project project = projectDomainRepository.findById(globalDTO.projectId())
//                .orElseThrow(()->new ProjectNotFoundException("Project Not found"));
//        return projectMapper.toProjectDTO(project);
//
//    }
//
//    @Override
//    public PagedProjectDTO getAssociateOldProjectsByLabel(GlobalDTO globalDTO,AssociateProjectByLabelDTO associateProjectByLabelDTO) {
//
//        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjectsByLabel
//                        (globalDTO.userId(),
//                                associateProjectByLabelDTO.label(),
//                                PageRequest.of(associateProjectByLabelDTO.pageNumber(),
//                                        (associateProjectByLabelDTO.pageSize() != null) ? associateProjectByLabelDTO.pageSize() : 10))
//                .orElseThrow(()->new UserNotFoundException("user not found"));
//
//        return new PagedProjectDTO(pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
//                pagedProjects.getTotalPages(),
//                pagedProjects.getTotalElements(),
//                associateProjectByLabelDTO.pageNumber() + 1,
//                associateProjectByLabelDTO.pageSize()
//        );
//    }

    @Override
    public RcProjectsCountDTO getAssociateProjectsCount(GlobalDTO globalDTO) {

        return projectMapper.toProjectsCount(projectDomainRepository.fetchAssociateProjectsCount(globalDTO.userId())
                        .orElseThrow(()->new UserNotFoundException("user not found"))
        );
    }

//    @Override
//    public PagedProjectDTO getAssociateProjectsByClient(GlobalDTO globalDTO,AssociateProjectByClientDTO associateProjectByClientDTO) {
//
//        Page<Project> pagedProjects = projectDomainRepository.fetchAssociateOldProjectsByClient(
//                        globalDTO.userId(),
//                       associateProjectByClientDTO.clientId(),
//                        PageRequest.of(associateProjectByClientDTO.pageNumber(),
//                                (associateProjectByClientDTO.pageSize() != null) ? associateProjectByClientDTO.pageSize() : 10))
//                .orElseThrow(()->new UserNotFoundException("user not found"));
//
//        return new PagedProjectDTO(pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
//                pagedProjects.getTotalPages(),
//                pagedProjects.getTotalElements(),
//                associateProjectByClientDTO.pageNumber() + 1,
//               associateProjectByClientDTO.pageSize()
//        );
//    }
//
//    @Override
//    public ProjectDashBoardDTO getLongestDurationProject() {
//        return projectMapper.toProjectDashBoardDTO(projectDomainRepository.findLongestDurationProject()
//                .orElseThrow(() -> new ProjectNotFoundException("No projects exist")));
//    }
//
//    //@Override
//    @Transactional
//    public ProjectLargestMembersDTO getRCLargestMembersProject() {
//        ProjectLargestMembersProjection largestMembersProjection=projectDomainRepository.fetchRCProjectWithLargestTeam().orElseThrow(()->new ProjectNotFoundException("no project was found"));
//        System.out.println(largestMembersProjection.getProjectId()+"v"+largestMembersProjection.getUsersCount());
//        List<String> membersProjections=projectDomainRepository.findFirst5UsersByProject(largestMembersProjection.getProjectId()).orElseThrow(()->new ProjectNotFoundException("project not found")).stream().map(ProjectMembersProjection::getInitials).toList();
//        return new ProjectLargestMembersDTO(largestMembersProjection.getProjectId(), largestMembersProjection.getLabel(), largestMembersProjection.getTitre(),
//                largestMembersProjection.getStatus(),largestMembersProjection.getDeadLine(),largestMembersProjection.getStartDate(),
//                membersProjections, largestMembersProjection.getUsersCount());
//
//    }
//
//    @Override
//    public RcProjectsCountDTO getCompletedProjectsCount() {
//
//        return projectMapper.toProjectsCount(projectDomainRepository.countDistinctByStatusEquals(ProjectStatus.COMPLETED));
//    }
//
//
//    @Override
//    public ProjectDTO updateProject(UpdateProjectDTO updateProjectDTO) {
//
//        Project project = projectMapper.toProject(updateProjectDTO);
//        Project dbProject = projectDomainRepository.findById(project.getProjectId()).orElseThrow(() -> new ProjectNotFoundException("project doesn't exist"));
//        project.setIsDeleted(dbProject.getIsDeleted());
//        project.setOwner(dbProject.getOwner());
//        projectDomainRepository.save(project);
//        return projectMapper.toProjectDTO(project);
//    }
//
//    @Override
//    public RcProjectsCountDTO getRcCountInactiveProjects() {
//        return projectMapper.toProjectsCount(projectDomainRepository.countDistinctByStatusEquals(ProjectStatus.INACTIVE));
//    }
//
//    @Override
//    public List<ProjectDropDownDTO> getRcProjectsByClient(GlobalDTO globalDTO) {
//        return projectDomainRepository.findAllByOwner_ClientId(globalDTO.clientId()).orElseThrow(() -> new ClientNotFoundException("Client not found")).stream().map(projectMapper::toProjectDropDownDTO).toList();
//    }
//
//    @Override
//    public List<ProjectDropDownDTO> getRcProjectsByLabel(String label) {
//        if(label.isBlank()) return projectDomainRepository.findAllBy(PageRequest.of(0,10)).orElseThrow(() -> new ProjectNotFoundException("No projects exist")).stream().map(projectMapper::toProjectDropDownDTO).toList();
//        return projectDomainRepository.findTop10ByLabelContainsIgnoreCase(label).orElseThrow(() -> new ProjectNotFoundException("No projects exist")).stream().map(projectMapper::toProjectDropDownDTO).toList();
//    }


//    @Override
//    public ProjectDTO deleteProject(GlobalDTO globalDTO) {
//
//        Project project=projectDomainRepository.findById(globalDTO.projectId()).orElseThrow(() -> new ProjectNotFoundException("project doesn't exist"));
//        project.setIsDeleted(true);
//        projectDomainRepository.save(project);
//        return projectMapper.toProjectDTO(project);
//    }

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
    public RcProjectsCountDTO countActiveProjects() {
        return projectMapper.toProjectsCount(projectDomainRepository.countDistinctByStatusEquals(ProjectStatus.ACTIVE));
    }

    @Override
    public List<ProjectDTO> getInitialRCProjects() {
        return projectDomainRepository.findAll(

                PageRequest.of(0, 10)).getContent().stream().map(projectMapper::toProjectDTO).toList();
    }

    @Override
    public RcProjectsCountDTO countTotalProjects() {
        return projectMapper.toProjectsCount( projectDomainRepository.count());
    }

    @Override
    public RcProjectsCountDTO getCompletedProjectsCount() {
        return projectMapper.toProjectsCount(projectDomainRepository.countDistinctByStatusEquals(ProjectStatus.COMPLETED));
    }

    @Override
    public RcProjectsCountDTO getRcCountInactiveProjects() {
        return projectMapper.toProjectsCount(projectDomainRepository.countDistinctByStatusEquals(ProjectStatus.INACTIVE));
    }

    @Override
    public RcProjectsCountDTO countCancelledProjects() {
        return projectMapper.toProjectsCount(projectDomainRepository.countDistinctByStatusEquals(ProjectStatus.CANCELLED));
    }

    @Override
    public RcProjectsCountDTO getRcCountProjectByStatus(ProjectStatus projectStatus) {
        return projectMapper.toProjectsCount(projectDomainRepository.countDistinctByStatusEquals(projectStatus));
    }
//
//    @Override
//    public RcCompletedProjectsCountDTO getRcCompletedProjectsCount() {
//        return projectMapper.toRcCompletedProjectsCountDTO(projectDomainRepository.countDistinctByStatusEquals(ProjectStatus.COMPLETED));
//    }
//
    @Override
    public ProjectDTO getRcLongestDurationProject() {
        Specification<Project> spec = (root, query, cb) -> {
            query.orderBy(
                    cb.desc(cb.function("DATEDIFF", Integer.class,
                            root.get("deadLine"),
                            root.get("startDate")))
            );
            return cb.conjunction();
        };

        Page<Project> result = projectDomainRepository.findAll(
                spec,
                PageRequest.of(0, 1) // LIMIT 1
        );

        return projectMapper.toProjectDTO(result.getContent().get(0));
    }

    private List<Object[]> getLargestTeamProject(){
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = cb.createQuery(Object[].class);
        Root<AssignedRotation> root = query.from(AssignedRotation.class);

        // Join to Project to select it
        Join<AssignedRotation, Project> projectJoin = root.join("project");

        // Count distinct users for each project
        Expression<Long> userCount = cb.countDistinct(root.get("user"));

        // SELECT: Project object and the count of distinct users
        query.multiselect(projectJoin, userCount);

        // WHERE: Filter by rotation status
        query.where(cb.equal(root.get("rotationAssignmentStatus"), "ACTIVE"));

        // GROUP BY: Group results by project
        query.groupBy(projectJoin);

        // ORDER BY: Order by user count descending
        query.orderBy(cb.desc(userCount));

        // Execute query and apply LIMIT (setMaxResults)
        return  entityManager.createQuery(query)
                .setMaxResults(1) // Get the project with the highest user count
                .getResultList();
    }

    @Override
    public ProjectLargestMembersDTO getRcLargestTeamProject() {
        List<Object[]> result=getLargestTeamProject();
        Project project=(Project) result.get(0)[0];
        Long usersCount= (Long) result.get(0)[1];
        System.out.println(project.getProjectId());
        List<String> usersList=getTop5UserInitialsByProject(project.getProjectId());
        return new ProjectLargestMembersDTO(projectMapper.toProjectDTO(project),usersList,usersCount);

    }
    private List<String> getTop5UserInitialsByProject(UUID projectId) {
        if (projectId == null) {
            return List.of();
        }

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<String> cq = cb.createQuery(String.class);
        Root<AssignedRotation> arRoot = cq.from(AssignedRotation.class); // Start from AssignedRotation


        Join<AssignedRotation, User> userJoin = arRoot.join("user"); // "user" is the field name in AssignedRotation
        Join<AssignedRotation, Project> projectJoin = arRoot.join("project");

        Expression<String> firstNameInitial = cb.substring(userJoin.get("firstName"), 1, 1);
        Expression<String> lastNameInitial = cb.substring(userJoin.get("lastName"), 1, 1);
        Expression<String> initials = cb.concat(firstNameInitial, lastNameInitial);

        cq.multiselect(
                initials.alias("initials")
        );


        Predicate projectPredicate = cb.equal(arRoot.get("project").get("projectId"),projectId);
        cq.where(projectPredicate);

        cq.where(cb.equal(arRoot.get("rotationAssignmentStatus"), "ACTIVE"));
        // --- GROUP BY clause: Group by user ID ---
        cq.groupBy(userJoin.get("userId"));

        // --- ORDER BY clause: Order by user ID descending ---
        cq.orderBy(cb.desc(userJoin.get("userId")));

        // --- Execute the query and apply LIMIT ---
        List<String> resultList = entityManager.createQuery(cq)
                .setMaxResults(5) // Apply LIMIT 5
                .getResultList();

        return resultList;
    }

    @Override
    public List<ProjectDropDownDTO> getRcAllProjectsByClient(GlobalDTO globalDTO) {
        return projectDomainRepository.findAllByOwner_ClientIdAndIsDeleted(globalDTO.clientId(),false).orElseThrow().stream().map(projectMapper::toProjectDropDownDTO).toList();
    }

    @Override
    public List<ProjectDropDownDTO> getRcAllProjects() {
        return projectDomainRepository.findAllByIsDeleted(false).orElseThrow(()->new ProjectNotFoundException("project not found")).
                stream().map(projectMapper::toProjectDropDownDTO).toList();
    }

    /*@Override
    public ProjectDTO getLargestTeamProject() {
        Project project = projectDomainRepository
                .fetchProjectWithLargestTeam(globalDTO.userId())
                .orElseThrow(() -> new ProjectNotFoundException("No project with a large team found"));
        return projectMapper.toProjectDTO(project);
    }*/
    @Override
    public ProjectDTO deleteProject(UUID projectId) {

        Project project=projectDomainRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("project doesn't exist"));
        project.setIsDeleted(true);
        project.setStatus(ProjectStatus.CANCELLED);
        projectDomainRepository.save(project);
        return projectMapper.toProjectDTO(project);
    }
    @Override
    public ProjectDTO updateProject(UpdateProjectDTO projectDTO) {

        Project project = projectMapper.toProject(projectDTO);

        if(!projectDomainRepository.existsById(project.getProjectId()))throw new  ProjectNotFoundException("project doesn't exist");
        Client client =clientDomainRepository.findById(projectDTO.clientId()).orElseThrow(()->new ClientNotFoundException("client dones't exist"));
        project.setOwner(client);
        return projectMapper.toProjectDTO(projectDomainRepository.save(project));
    }

    @Override
    public ProjectDTO addProject(AddProjectDTO addProjectDTO) {
        Project project = projectMapper.toProject(addProjectDTO);
        Client client =clientDomainRepository.findById(addProjectDTO.clientId()).orElseThrow(()->new ClientNotFoundException("client dones't exist"));
        project.setIsDeleted(false);
        project.setOwner(client);
        return  projectMapper.toProjectDTO(projectDomainRepository.save(project));

    }
    @Override
    public PagedProjectDTO getRCProjects(PagedGlobalDTO pagedGlobalDTO) {
        Page<Project> pagedProjects = projectDomainRepository.findAll(

                PageRequest.of(pagedGlobalDTO.pageNumber(),
                        pagedGlobalDTO.pageSize() != null ? pagedGlobalDTO.pageSize() : 10));

        return new PagedProjectDTO(
                pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                pagedGlobalDTO.pageNumber() + 1,
                pagedGlobalDTO.pageSize()
        );
    }

    @Override
    public PagedProjectDTO getRCFilteredProjects(ProjectFilterDTO projectFilterDTO) {

        PageRequest pageRequest=PageRequest.of(projectFilterDTO.pageNumber(),
                projectFilterDTO.pageSize() != null ? projectFilterDTO.pageSize() : 10);
        Page<Project> pagedProjects;

        if(projectFilterDTO.filter().equals("projectLabel")) {
            switch (projectFilterDTO.sort()) {

                case "titre" : {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("titre").ascending():Sort.by("titre").descending();
                    pagedProjects= projectDomainRepository.findAllByLabelContainingIgnoreCase(projectFilterDTO.value(), pageRequest.withSort(sort)).orElseThrow(()->new ProjectNotFoundException("no projects were founds"));
                    break;
                }
                case "client" : {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("owner.label").ascending():Sort.by("owner.label").descending();
                    pagedProjects= projectDomainRepository.findAllByLabelContainingIgnoreCase(projectFilterDTO.value(), pageRequest.withSort(sort)).orElseThrow(()->new ProjectNotFoundException("no projects were founds"));
                    break;
                }
                case "status" : {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("status").ascending():Sort.by("status").descending();
                    pagedProjects= projectDomainRepository.findAllByLabelContainingIgnoreCase(projectFilterDTO.value(), pageRequest.withSort(sort)).orElseThrow(()->new ProjectNotFoundException("no projects were founds"));
                    break;
                }
                default: {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("label").ascending():Sort.by("label").descending();
                    pagedProjects= projectDomainRepository.findAllByLabelContainingIgnoreCase(projectFilterDTO.value(), pageRequest.withSort(sort)).orElseThrow(()->new ProjectNotFoundException("no projects were founds"));

                }

            }
        } else if(projectFilterDTO.filter().equals("clientLabel")) {
            switch (projectFilterDTO.sort()) {

                case "titre" : {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("titre").ascending():Sort.by("titre").descending();
                    pagedProjects= projectDomainRepository.findAllByOwner_LabelContainingIgnoreCase(projectFilterDTO.value(), pageRequest.withSort(sort)).orElseThrow(()->new ProjectNotFoundException("no projects were founds"));
                    break;
                }
                case "client" : {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("owner.label").ascending():Sort.by("owner.label").descending();
                    pagedProjects= projectDomainRepository.findAllByOwner_LabelContainingIgnoreCase(projectFilterDTO.value(), pageRequest.withSort(sort)).orElseThrow(()->new ProjectNotFoundException("no projects were founds"));
                    break;
                }
                case "status" : {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("status").ascending():Sort.by("status").descending();
                    pagedProjects= projectDomainRepository.findAllByOwner_LabelContainingIgnoreCase(projectFilterDTO.value(), pageRequest.withSort(sort)).orElseThrow(()->new ProjectNotFoundException("no projects were founds"));
                    break;
                }
                default: {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("label").ascending():Sort.by("label").descending();
                    pagedProjects= projectDomainRepository.findAllByOwner_LabelContainingIgnoreCase(projectFilterDTO.value(), pageRequest.withSort(sort)).orElseThrow(()->new ProjectNotFoundException("no projects were founds"));

                }

            }
        }
        else  {
            switch (projectFilterDTO.sort()) {

                case "titre" : {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("titre").ascending():Sort.by("titre").descending();
                    pagedProjects= projectDomainRepository.findAll(pageRequest.withSort(sort));
                    break;
                }
                case "client" : {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("owner.label").ascending():Sort.by("owner.label").descending();
                    pagedProjects= projectDomainRepository.findAll(pageRequest.withSort(sort));
                    break;
                }
                case "status" : {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("status").ascending():Sort.by("status").descending();
                    pagedProjects= projectDomainRepository.findAll( pageRequest.withSort(sort));
                    break;
                }
                default: {
                    Sort sort=(projectFilterDTO.sortType() == 1) ?Sort.by("label").ascending():Sort.by("label").descending();
                    pagedProjects= projectDomainRepository.findAll( pageRequest.withSort(sort));

                }

            }
        }
        return new PagedProjectDTO(
                pagedProjects.getContent().stream().map(projectMapper::toProjectDTO).toList(),
                pagedProjects.getTotalPages(),
                pagedProjects.getTotalElements(),
                projectFilterDTO.pageNumber() + 1,
                projectFilterDTO.pageSize()
        );
    }

}
