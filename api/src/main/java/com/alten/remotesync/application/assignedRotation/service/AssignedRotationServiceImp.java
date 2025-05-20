package com.alten.remotesync.application.assignedRotation.service;

import com.alten.remotesync.adapter.exception.assignedRotation.AssignedRotationNotFoundException;
import com.alten.remotesync.adapter.exception.assignedRotation.CapacityExceededException;
import com.alten.remotesync.adapter.exception.client.ClientNotFoundException;
import com.alten.remotesync.adapter.exception.factory.FactoryNotFoundException;
import com.alten.remotesync.adapter.exception.project.ProjectNotFoundException;
import com.alten.remotesync.adapter.exception.subFactory.SubFactoryNotFoundException;
import com.alten.remotesync.adapter.exception.user.UserNotFoundException;
import com.alten.remotesync.application.assignedRotation.mapper.AssignedRotationMapper;
import com.alten.remotesync.application.assignedRotation.record.request.*;
import com.alten.remotesync.application.assignedRotation.record.response.AssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.response.PagedAssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.response.PagedRotationsDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.assignedRotation.model.embeddable.AssignedRotationId;
import com.alten.remotesync.domain.assignedRotation.projection.ActiveAssignedRotationProjection;
import com.alten.remotesync.domain.assignedRotation.repository.AssignedRotationDomainRepository;

import com.alten.remotesync.domain.client.repository.ClientDomainRepository;
import com.alten.remotesync.domain.customDate.model.CustomDate;
import com.alten.remotesync.domain.factory.repository.FactoryDomainRepository;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.project.repository.ProjectDomainRepository;
import com.alten.remotesync.domain.rotation.enumeration.RotationStatus;
import com.alten.remotesync.domain.rotation.model.Rotation;
import com.alten.remotesync.domain.rotation.repository.RotationDomainRepository;
import com.alten.remotesync.domain.subFactory.repository.SubFactoryDomainRepository;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Component
@RequiredArgsConstructor
public class AssignedRotationServiceImp implements AssignedRotationService {
    private final AssignedRotationDomainRepository assignedRotationDomainRepository;
    private final AssignedRotationMapper assignedRotationMapper;
    private final RotationDomainRepository rotationDomainRepository;
    private final UserDomainRepository userDomainRepository;
    private final ProjectDomainRepository projectDomainRepository;
    private final ClientDomainRepository clientDomainRepository;
    private final FactoryDomainRepository factoryDomainRepository;
    private final SubFactoryDomainRepository subFactoryDomainRepository;
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
    public PagedRotationsDTO getUsersActiveRotationsByName(UsersRotationsByNameDTO usersRotationsByNameDTO) {
        Pageable pageable = PageRequest.of(usersRotationsByNameDTO.pageNumber(),usersRotationsByNameDTO.pageSize());
        Page<ActiveAssignedRotationProjection> assignedRotationPage = assignedRotationDomainRepository.findActiveAssignedRotationByName(RotationAssignmentStatus.ACTIVE, pageable, usersRotationsByNameDTO.name());

        return new PagedRotationsDTO(assignedRotationPage.toList(), assignedRotationPage.getTotalPages(), assignedRotationPage.getTotalElements(), usersRotationsByNameDTO.pageNumber(), usersRotationsByNameDTO.pageSize());
    }

    @Override
    public PagedRotationsDTO getUsersActiveRotationsByProject(UsersRotationsByProjectDTO usersRotationsByProjectDTO) {
        UUID projectId=UUID.fromString( usersRotationsByProjectDTO.projectId());
        if(projectDomainRepository.findById(projectId).isPresent()) {
            Pageable pageable = PageRequest.of(usersRotationsByProjectDTO.pageNumber(), usersRotationsByProjectDTO.pageSize());

            Page<ActiveAssignedRotationProjection> assignedRotationPage = assignedRotationDomainRepository.findAllByRotationAssignmentStatusAndProject_ProjectId(RotationAssignmentStatus.ACTIVE, pageable, projectId);

            return new PagedRotationsDTO(assignedRotationPage.toList(), assignedRotationPage.getTotalPages(), assignedRotationPage.getTotalElements(), usersRotationsByProjectDTO.pageNumber(), usersRotationsByProjectDTO.pageSize());
        }
        throw new ProjectNotFoundException("project not found");
    }

    @Override
    public PagedRotationsDTO getUsersActiveRotationsByClient(UsersRotationsByClientDTO usersRotationsByClientDTO) {

     UUID clientId=UUID.fromString(usersRotationsByClientDTO.clientId());
     if(clientDomainRepository.findById(clientId).isPresent())   {
            Pageable pageable = PageRequest.of(usersRotationsByClientDTO.pageNumber(), usersRotationsByClientDTO.pageSize());
            Page<ActiveAssignedRotationProjection> assignedRotationPage = assignedRotationDomainRepository.findAllByRotationAssignmentStatusAndProject_Owner_ClientId(RotationAssignmentStatus.ACTIVE, pageable, clientId);

            return new PagedRotationsDTO(assignedRotationPage.toList(), assignedRotationPage.getTotalPages(), assignedRotationPage.getTotalElements(), usersRotationsByClientDTO.pageNumber(), usersRotationsByClientDTO.pageSize());
        }
     throw new ClientNotFoundException("client not found");
    }

    @Override
    public PagedRotationsDTO getUsersActiveRotationsByFactory(UsersRotationsByFactoryDTO usersRotationsByFactoryDTO) {
        UUID factoryId=UUID.fromString(usersRotationsByFactoryDTO.factoryId());
        if(factoryDomainRepository.findById(factoryId).isPresent())   {
            Pageable pageable = PageRequest.of(usersRotationsByFactoryDTO.pageNumber(),usersRotationsByFactoryDTO.pageSize());
            Page<ActiveAssignedRotationProjection> assignedRotationPage = assignedRotationDomainRepository.findAllByRotationAssignmentStatusAndUser_SubFactory_Factory_FactoryId(RotationAssignmentStatus.ACTIVE, pageable, factoryId);

            return new PagedRotationsDTO(assignedRotationPage.toList(), assignedRotationPage.getTotalPages(), assignedRotationPage.getTotalElements(), usersRotationsByFactoryDTO.pageNumber(), usersRotationsByFactoryDTO.pageSize());
        }
        throw new FactoryNotFoundException("Factory not found ");
    }

    @Override
    public PagedRotationsDTO getUsersActiveRotationsBySubFactory(UsersRotationsBySubFactoryDTO usersRotationsBySubFactoryDTO) {
        UUID subFactoryId=UUID.fromString(usersRotationsBySubFactoryDTO.subFactoryId());
        if(subFactoryDomainRepository.findById(subFactoryId).isPresent())   {
            Pageable pageable = PageRequest.of(usersRotationsBySubFactoryDTO.pageNumber(),usersRotationsBySubFactoryDTO.pageSize());
            Page<ActiveAssignedRotationProjection> assignedRotationPage = assignedRotationDomainRepository.findAllByRotationAssignmentStatusAndUser_SubFactory_SubFactoryID(RotationAssignmentStatus.ACTIVE, pageable, subFactoryId);

            return new PagedRotationsDTO(assignedRotationPage.toList(), assignedRotationPage.getTotalPages(), assignedRotationPage.getTotalElements(),usersRotationsBySubFactoryDTO.pageNumber(), usersRotationsBySubFactoryDTO.pageSize());
        }
        throw new SubFactoryNotFoundException("SubFactory not found ");
    }

    @Override
    public PagedRotationsDTO getUsersActiveRotations(PagedGlobalDTO globalDTO) {
        Pageable pageable = PageRequest.of(globalDTO.pageNumber(), globalDTO.pageSize());
        Page<ActiveAssignedRotationProjection> assignedRotationPage = assignedRotationDomainRepository.findAllByRotationAssignmentStatus(RotationAssignmentStatus.ACTIVE, pageable);

        return new PagedRotationsDTO(assignedRotationPage.toList(), assignedRotationPage.getTotalPages(), assignedRotationPage.getTotalElements(), globalDTO.pageNumber(), globalDTO.pageSize());
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
    @Transactional
    public void updateRotationByDate(UpdateRotationDTO updateRotationDTO) {

        Long totalCapacity=subFactoryDomainRepository.TotalCapacity();
        Long dateCapacity=assignedRotationDomainRepository.countActiveRotationsForByDate(LocalDate.parse(updateRotationDTO.updatedDate()));



        if(updateRotationDTO.updatedStatus()== RotationStatus.ONSITE && dateCapacity>totalCapacity) throw new CapacityExceededException(updateRotationDTO.updatedDate());
        Rotation dbRotation = rotationDomainRepository.save(
                Rotation.builder()
                        .shift(updateRotationDTO.shift())
                        .cycle(updateRotationDTO.cycle())
                        .endDate(LocalDate.parse(updateRotationDTO.endDate()))
                        .startDate(LocalDate.parse(updateRotationDTO.startDate()))
                        .customDates(updateRotationDTO.customDates())
                        .build()
        );

        Project project = (updateRotationDTO.projectId() != null) ? projectDomainRepository.findById(UUID.fromString(updateRotationDTO.projectId())).orElseThrow(() -> new ProjectNotFoundException("project not found")) : null;

        User user = userDomainRepository.findById(UUID.fromString(updateRotationDTO.userId())).orElseThrow(() -> new UserNotFoundException("user not found"));

        Optional<AssignedRotation> activeAssignedRotation = assignedRotationDomainRepository.findByUser_UserIdAndRotationAssignmentStatus(user.getUserId(), RotationAssignmentStatus.ACTIVE);

        if (activeAssignedRotation.isPresent()) {
            AssignedRotation overriddenAssignedRotation = activeAssignedRotation.get();
            updateRotation(overriddenAssignedRotation);
        }

        assignedRotationDomainRepository.save(AssignedRotation.builder()
                .assignedRotationId(new AssignedRotationId(user.getUserId(), dbRotation.getRotationId()))
                .project(project)
                .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                .rotation(dbRotation)
                .user(user)
                .build());


    }

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

    private void checkCustomDatesCapacity(Long totalCapacity,List<CustomDate> customDates){
        List<CustomDate> onSiteCustomDates = customDates.stream().filter(customDate -> customDate.getRotationStatus()==RotationStatus.ONSITE).toList();
        onSiteCustomDates.forEach(customDate -> {
            Long onSiteCapacity=assignedRotationDomainRepository.countActiveRotationsForByDate(customDate.getDate());
            if( onSiteCapacity>totalCapacity) throw new CapacityExceededException(customDate.getDate().toString());

        }  );
    }
    private void checkAutoRotationCapacity(Long totalCapacity,int shift,int cycle,LocalDate startDate,LocalDate endDate){
        for(int i=0;i<5;i++) {
            for(int j=0;j<shift;j++) {
                LocalDate date = startDate.plusWeeks((long) cycle*(j+i));
                if(date.isAfter(endDate)) return;
                Long onSiteCapacity=assignedRotationDomainRepository.countActiveRotationsForByDate(date);
                if( onSiteCapacity>totalCapacity) throw new CapacityExceededException(date.toString());
                System.out.println(date);
            }

        }

    }
    @Override
    @Transactional
    public CreateAssignedRotationDTO createAssignedRotation(CreateAssignedRotationDTO createAssignedRotationDTO) {

        Long totalCapacity=subFactoryDomainRepository.TotalCapacity();

        checkAutoRotationCapacity(
                totalCapacity,
                createAssignedRotationDTO.shift(),
                createAssignedRotationDTO.cycle(),
                LocalDate.parse(createAssignedRotationDTO.startDate()),
                LocalDate.parse(createAssignedRotationDTO.endDate()));
        if(createAssignedRotationDTO.customDates()!=null)checkCustomDatesCapacity(totalCapacity,createAssignedRotationDTO.customDates());

        Rotation dbRotation = rotationDomainRepository.save(Rotation.builder().startDate(LocalDate.parse(createAssignedRotationDTO.startDate()))
                .endDate(LocalDate.parse(createAssignedRotationDTO.endDate()))
                .cycle(createAssignedRotationDTO.cycle())
                .shift(createAssignedRotationDTO.shift())
                .customDates(createAssignedRotationDTO.customDates())
                .build());


        Project dbProject = (createAssignedRotationDTO.projectId() != null) ? projectDomainRepository.findById(UUID.fromString(createAssignedRotationDTO.projectId())).orElseThrow(() -> new ProjectNotFoundException("project not found")) : null;

        createAssignedRotationDTO.associates().forEach(associateId -> {
            //TODO : use entityManager to get the User rather than fetching it from the db
            User associate = userDomainRepository.findById(UUID.fromString(associateId)).orElseThrow(() -> new UserNotFoundException("user not found"));

            try{
            Optional<AssignedRotation> activeAssignedRotation = assignedRotationDomainRepository.findByUser_UserIdAndRotationAssignmentStatus(associate.getUserId(), RotationAssignmentStatus.ACTIVE);
            System.out.println("hiiii"+activeAssignedRotation.isPresent());
            if (activeAssignedRotation.isPresent()) {

                AssignedRotation overriddenAssignedRotation = activeAssignedRotation.get();
                System.out.println(overriddenAssignedRotation.getAssignedRotationId());
                updateRotation(overriddenAssignedRotation);
            }
            assignedRotationDomainRepository.save(AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(associate.getUserId(), dbRotation.getRotationId()))
                    .user(associate)
                    .rotation(dbRotation)
                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                    .project(dbProject)
                    .build());
            }catch(IncorrectResultSizeDataAccessException e){
                System.out.println(e);
            }
        });


        return createAssignedRotationDTO;
    }

    @Override
    public Long currentWeekOnSiteAssociatesCount() {

        LocalDate startOfWeekMonday =  LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        return assignedRotationDomainRepository.countActiveRotationsForByDate(startOfWeekMonday);

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
