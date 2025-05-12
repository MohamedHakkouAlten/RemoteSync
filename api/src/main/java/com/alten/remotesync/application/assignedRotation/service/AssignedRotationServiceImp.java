package com.alten.remotesync.application.assignedRotation.service;

import com.alten.remotesync.adapter.exception.assignedRotation.AssignedRotationNotFoundException;
import com.alten.remotesync.adapter.exception.project.ProjectNotFoundException;
import com.alten.remotesync.adapter.exception.user.UserNotFoundException;
import com.alten.remotesync.application.assignedRotation.mapper.AssignedRotationMapper;
import com.alten.remotesync.application.assignedRotation.record.request.CreateAssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.request.UsersRotationsByFactoryDTO;
import com.alten.remotesync.application.assignedRotation.record.request.UsersRotationsByNameDTO;
import com.alten.remotesync.application.assignedRotation.record.response.AssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.response.PagedAssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.response.PagedRotationsDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
import com.alten.remotesync.application.rotation.service.RotationService;
import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.assignedRotation.model.embeddable.AssignedRotationId;
import com.alten.remotesync.domain.assignedRotation.projection.ActiveAssignedRotationProjection;
import com.alten.remotesync.domain.assignedRotation.repository.AssignedRotationDomainRepository;

import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.project.repository.ProjectDomainRepository;
import com.alten.remotesync.domain.rotation.model.Rotation;
import com.alten.remotesync.domain.rotation.repository.RotationDomainRepository;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AssignedRotationServiceImp implements AssignedRotationService {
    private final AssignedRotationDomainRepository assignedRotationDomainRepository;
    private final AssignedRotationMapper assignedRotationMapper;
    private final RotationDomainRepository rotationDomainRepository;
    private final UserDomainRepository userDomainRepository;
    private final ProjectDomainRepository projectDomainRepository;
    @Override
    public AssignedRotationDTO getAssociateCurrentRotationWithProject(GlobalDTO globalDTO) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        AssignedRotation assignedRotations = assignedRotationDomainRepository.findAssignedRotationByUser_UserIdAndProject_ProjectIdAndRotationAssignmentStatus(
                globalDTO.userId(),
                globalDTO.projectId(),
                RotationAssignmentStatus.ACTIVE,
                sort).orElseThrow(() -> new AssignedRotationNotFoundException("Assigned Rotation Not Found"));

        return assignedRotationMapper.toAssignedRotationDTO(assignedRotations);
    }

    @Override // NEED REWORK (PAGEABLE IF POSSIBLE IN THE FUTURE)
    public List<AssignedRotationDTO> getAssociateOldRotationsWithProject(GlobalDTO globalDTO) {
        Sort sort = Sort.by(Sort.Direction.ASC, "createdAt");
        List<AssignedRotation> assignedRotations = assignedRotationDomainRepository.findAllAssignedRotationByUser_UserIdAndProject_ProjectIdAndRotationAssignmentStatus(
                globalDTO.userId(),
                globalDTO.projectId(),
                RotationAssignmentStatus.OVERRIDDEN,
                sort).orElseThrow(() -> new AssignedRotationNotFoundException("Assigned Rotation Not Found"));

        return assignedRotations.stream().map(assignedRotationMapper::toAssignedRotationDTO).toList();
    }

    @Override
    public AssignedRotationDTO getAssociateCurrentRotationWithoutProject(GlobalDTO globalDTO) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        AssignedRotation assignedRotations = assignedRotationDomainRepository.findAssignedRotationByUser_UserIdAndProjectIsNullAndRotationAssignmentStatus(
                globalDTO.userId(),
                RotationAssignmentStatus.ACTIVE,
                sort).orElseThrow(() -> new AssignedRotationNotFoundException("Assigned Rotation Not Found"));

        return assignedRotationMapper.toAssignedRotationDTO(assignedRotations);
    }

    @Override // NEED REWORK (PAGEABLE IF POSSIBLE IN THE FUTURE)
    public List<AssignedRotationDTO> getAssociateOldRotationsWithoutProject(GlobalDTO globalDTO) {
        Sort sort = Sort.by(Sort.Direction.ASC, "createdAt");
        List<AssignedRotation> assignedRotations = assignedRotationDomainRepository.findAllAssignedRotationByUser_UserIdAndRotationAssignmentStatus(
                globalDTO.userId(),
                RotationAssignmentStatus.OVERRIDDEN,
                sort).orElseThrow(() -> new AssignedRotationNotFoundException("Assigned Rotation Not Found"));

        return assignedRotations.stream().map(assignedRotationMapper::toAssignedRotationDTO).toList();
    }

    @Override
    public Float onSiteAssociatesPercentage() {
        return 0f;
    }

    @Override
    public PagedRotationsDTO getUsersActiveRotations(PagedGlobalDTO globalDTO) {
        Pageable pageable = PageRequest.of(globalDTO.pageNumber(), globalDTO.pageSize());
        Page<ActiveAssignedRotationProjection> assignedRotationPage = assignedRotationDomainRepository.findAllByRotationAssignmentStatus(RotationAssignmentStatus.ACTIVE,pageable);

        return new PagedRotationsDTO(assignedRotationPage.toList(),assignedRotationPage.getTotalPages(),assignedRotationPage.getTotalElements(), globalDTO.pageNumber(), globalDTO.pageSize());
    }


    @Override
    public PagedAssignedRotationDTO getUsersRotationBySubFactory(UUID subFactoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AssignedRotation> assignedRotationPage =
                assignedRotationDomainRepository.findAllByUser_SubFactory_SubFactoryID(subFactoryId, pageable);

        List<AssignedRotationDTO> dtoList = assignedRotationPage
                .stream()
                .map(assignedRotationMapper::toAssignedRotationDTO)
                .toList();

        return new PagedAssignedRotationDTO(
                dtoList,
                assignedRotationPage.getTotalPages(),
                assignedRotationPage.getTotalElements(),
                assignedRotationPage.getNumber(),
                assignedRotationPage.getSize()
        );
    }

    @Override
    public void updateRotationByDate(UUID userId, Date date) {
        Sort sort = Sort.by(Sort.Direction.ASC, "createdAt");
        List<AssignedRotation> assignedRotations = assignedRotationDomainRepository
                .findAllAssignedRotationByUser_UserIdAndRotationAssignmentStatus(
                        userId,
                        RotationAssignmentStatus.ACTIVE,
                        sort)
                .orElseThrow(() -> new AssignedRotationNotFoundException("Assigned Rotation Not Found"));

        for (AssignedRotation assignedRotation : assignedRotations) {
//            if (isDateInRange(date, assignedRotation.getRotation())) {
//                updateRotation(assignedRotation);
//            }
        }
    }

//    private boolean isDateInRange(Date date, Rotation rotation) {
//        return !date.before(rotation.getStartDate()) && !date.after(rotation.getEndDate());
//    }

    private void updateRotation(AssignedRotation assignedRotation) {
        assignedRotation.setRotationAssignmentStatus(RotationAssignmentStatus.OVERRIDDEN);

        assignedRotationDomainRepository.save(assignedRotation);
    }

    @Override
    public PagedAssignedRotationDTO getUsersRotationByClient(UUID clientId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AssignedRotation> assignedRotationPage =
                assignedRotationDomainRepository.findAllByProject_Owner_ClientId(clientId, pageable);

        List<AssignedRotationDTO> dtoList = assignedRotationPage
                .stream()
                .map(assignedRotationMapper::toAssignedRotationDTO)
                .toList();

        return new PagedAssignedRotationDTO(
                dtoList,
                assignedRotationPage.getTotalPages(),
                assignedRotationPage.getTotalElements(),
                assignedRotationPage.getNumber(),
                assignedRotationPage.getSize()
        );
    }

    @Override
    @Transactional
    public CreateAssignedRotationDTO createAssignedRotation(CreateAssignedRotationDTO createAssignedRotationDTO) {



       Rotation dbRotation=rotationDomainRepository.save(Rotation.builder().startDate(LocalDate.parse(createAssignedRotationDTO.startDate()))
               .endDate(LocalDate.parse(createAssignedRotationDTO.endDate()))
               .cycle(createAssignedRotationDTO.cycle())
               .shift(createAssignedRotationDTO.shift())
               .customDates(createAssignedRotationDTO.customDates())
               .build());


       Project dbProject;
       if(createAssignedRotationDTO.projectId()!=null) dbProject=projectDomainRepository.findById(UUID.fromString(createAssignedRotationDTO.projectId())).orElseThrow(()->new ProjectNotFoundException("project not found"));
       else {
           dbProject = null;
       }

        createAssignedRotationDTO.associates().forEach(associateId->{
           //TODO : use entityManager to get the User rather than fetching it from the db
           User associate=userDomainRepository.findById(UUID.fromString(associateId)).orElseThrow(()->new UserNotFoundException("user not found"));

           Optional<AssignedRotation> activeAssignedRotation=assignedRotationDomainRepository.findByUser_UserIdAndRotationAssignmentStatus(associate.getUserId(),RotationAssignmentStatus.ACTIVE);
           if(activeAssignedRotation.isPresent()) {
               AssignedRotation OverriddenAssignedRotation=activeAssignedRotation.get();
               OverriddenAssignedRotation.setRotationAssignmentStatus(RotationAssignmentStatus.OVERRIDDEN);
               assignedRotationDomainRepository.save(OverriddenAssignedRotation);
           }
           assignedRotationDomainRepository.save(AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(associate.getUserId(), dbRotation.getRotationId()))
                   .user(associate)
                   .rotation(dbRotation)
                   .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                   .project(dbProject)
                   .build());
       });


        return createAssignedRotationDTO;
    }

//    @Override
//    public PagedAssignedRotationDTO getUsersActiveRotationsByName(UsersRotationsByNameDTO usersRotationsByNameDTO) {
//
//        Page<AssignedRotation> pagedAssignedRotations = assignedRotationDomainRepository.findAllAssignedRotationByUser_FirstNameContainsAndUser_LastNameContainsAndRotationAssignmentStatus(usersRotationsByNameDTO.name(),
//                usersRotationsByNameDTO.name(),
//                RotationAssignmentStatus.ACTIVE,
//                PageRequest.of(usersRotationsByNameDTO.pageNumber(),
//                        (usersRotationsByNameDTO.pageSize() != null) ? usersRotationsByNameDTO.pageSize() : 10)).orElseThrow(() -> new AssignedRotationNotFoundException("No rotations were found for this name"));
//
//        System.out.println(pagedAssignedRotations.getContent().stream().toList());
//        return new PagedAssignedRotationDTO(pagedAssignedRotations.getContent().stream().map(assignedRotationMapper::toAssignedRotationDTO).toList(),
//                pagedAssignedRotations.getTotalPages(),
//                pagedAssignedRotations.getTotalElements(),
//                usersRotationsByNameDTO.pageNumber() + 1,
//                usersRotationsByNameDTO.pageSize());
//    }
//
//    @Override
//    public PagedAssignedRotationDTO getUsersActiveRotationsByFactory(UsersRotationsByFactoryDTO usersRotationsByFactoryDTO) {
//
//        Page<AssignedRotation> pagedAssignedRotations = assignedRotationDomainRepository.findAllAssignedRotationByUser_SubFactory_Factory_FactoryIdAndRotationAssignmentStatus(usersRotationsByFactoryDTO.factoryId(),
//                RotationAssignmentStatus.ACTIVE,
//                PageRequest.of(usersRotationsByFactoryDTO.pageNumber(),
//                        (usersRotationsByFactoryDTO.pageSize() != null) ? usersRotationsByFactoryDTO.pageSize() : 10)).orElseThrow(() -> new AssignedRotationNotFoundException("No rotations were found for this name"));
//
//        System.out.println(pagedAssignedRotations.getContent().stream().toList());
//        return new PagedAssignedRotationDTO(pagedAssignedRotations.getContent().stream().map(assignedRotationMapper::toAssignedRotationDTO).toList(),
//                pagedAssignedRotations.getTotalPages(),
//                pagedAssignedRotations.getTotalElements(),
//                usersRotationsByFactoryDTO.pageNumber() + 1,
//                usersRotationsByFactoryDTO.pageSize());
//    }

}
