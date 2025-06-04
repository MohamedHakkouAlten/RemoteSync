package com.alten.remotesync.application.assignedRotation.service;

import com.alten.remotesync.adapter.exception.assignedRotation.CapacityExceededException;
import com.alten.remotesync.adapter.exception.client.ClientNotFoundException;
import com.alten.remotesync.adapter.exception.factory.FactoryNotFoundException;
import com.alten.remotesync.adapter.exception.project.ProjectNotFoundException;
import com.alten.remotesync.adapter.exception.subFactory.SubFactoryNotFoundException;
import com.alten.remotesync.adapter.exception.user.UserNotFoundException;
import com.alten.remotesync.application.assignedRotation.mapper.AssignedRotationMapper;
import com.alten.remotesync.application.assignedRotation.record.request.*;
import com.alten.remotesync.application.assignedRotation.record.response.*;
import com.alten.remotesync.application.client.mapper.ClientMapper;
import com.alten.remotesync.application.client.record.response.ClientDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
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
import jakarta.persistence.criteria.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AssignedRotationServiceImp implements AssignedRotationService {
    private final AssignedRotationDomainRepository assignedRotationDomainRepository;
    private final RotationDomainRepository rotationDomainRepository;
    private final UserDomainRepository userDomainRepository;
    private final ProjectDomainRepository projectDomainRepository;
    private final ClientDomainRepository clientDomainRepository;
    private final FactoryDomainRepository factoryDomainRepository;
    private final SubFactoryDomainRepository subFactoryDomainRepository;
    private final AssignedRotationMapper assignedRotationMapper;
    private final ClientMapper clientMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public List<ClientDTO> getAssociateClients(GlobalDTO globalDTO) {
        List<AssignedRotation> assignedRotations = assignedRotationDomainRepository.findAllDistinctByUser_UserId(globalDTO.userId()).orElseThrow();

        return assignedRotations.stream().map(m -> m.getProject().getOwner()).toList().stream().map(clientMapper::toClientDTO).toList();
    }

    @Override
    public OnSiteWeeksDTO getAssociateOnSiteWeeks(GlobalDTO globalDTO) {
        AssignedRotation assignedRotation = assignedRotationDomainRepository
                .findByUser_UserIdAndRotationAssignmentStatus(globalDTO.userId(), RotationAssignmentStatus.ACTIVE).orElseThrow();

        Integer countOnSiteWeeks = 0;
        List<LocalDate> onSiteDates = new ArrayList<>();

        Rotation rotation = assignedRotation.getRotation();
        LocalDate startDate = rotation.getStartDate();
        LocalDate endDate = rotation.getEndDate();

        int cycleLengthWeeks = rotation.getCycleLengthWeeks();       // e.g. 4
        int remoteWeeksPerCycle = rotation.getRemoteWeeksPerCycle(); // e.g. 3
        int onSiteWeeksPerCycle = cycleLengthWeeks - remoteWeeksPerCycle;

        // Go through each week between start and end
        LocalDate currentWeekStart = startDate.with(DayOfWeek.MONDAY);
        LocalDate endWeekStart = endDate.with(DayOfWeek.MONDAY);

        while (!currentWeekStart.isAfter(endWeekStart)) {
            // Determine which week of the cycle this is
            long weeksSinceStart = ChronoUnit.WEEKS.between(startDate.with(DayOfWeek.MONDAY), currentWeekStart);
            int weekInCycle = (int) (weeksSinceStart % cycleLengthWeeks);

            // If it's not a remote week => it's on-site
            if (weekInCycle >= remoteWeeksPerCycle) {
                countOnSiteWeeks++;

                for (int i = 0; i < 5; i++) {
                    LocalDate dayOfWeek = currentWeekStart.plusDays(i);
                    onSiteDates.add(dayOfWeek);
                }
            }

            currentWeekStart = currentWeekStart.plusWeeks(1);
        }

        return new OnSiteWeeksDTO(countOnSiteWeeks, onSiteDates);
    }

    @Override
    public AssociateCurrentRotationDTO getAssociateCurrentRotation(GlobalDTO globalDTO) {
        AssignedRotation assignedRotation = assignedRotationDomainRepository
                .findByUser_UserIdAndRotationAssignmentStatus(globalDTO.userId(), RotationAssignmentStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active rotation found for this user"));

        Rotation rotation = assignedRotation.getRotation();
        LocalDate startDate = rotation.getStartDate();
        LocalDate endDate = rotation.getEndDate();

        // Check if this rotation has custom dates
        List<CustomDate> customDates = rotation.getCustomDates();
        boolean hasCustomDates = customDates != null && !customDates.isEmpty();

        List<LocalDate> onSiteDates = new ArrayList<>();
        List<LocalDate> remoteDates = new ArrayList<>();

        // If we have custom dates, process them first
        if (hasCustomDates) {
            Map<LocalDate, RotationStatus> customDateMap = new HashMap<>();

            // Create a map of custom dates for quick lookup
            for (CustomDate customDate : customDates) {
                LocalDate date = customDate.getDate();
                // Only include weekdays (Monday to Friday)
                if (date.getDayOfWeek() != DayOfWeek.SATURDAY && date.getDayOfWeek() != DayOfWeek.SUNDAY) {
                    customDateMap.put(date, customDate.getRotationStatus());
                }
            }

            // Process all dates in the range
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                // Skip weekends
                if (currentDate.getDayOfWeek() != DayOfWeek.SATURDAY && currentDate.getDayOfWeek() != DayOfWeek.SUNDAY) {
                    // Check if this date has a custom status
                    if (customDateMap.containsKey(currentDate)) {
                        if (customDateMap.get(currentDate) == RotationStatus.ONSITE) {
                            onSiteDates.add(currentDate);
                        } else {
                            remoteDates.add(currentDate);
                        }
                    } else {
                        // If no custom status, use the automatic pattern
                        addDateBasedOnPattern(currentDate, startDate, rotation.getCycleLengthWeeks(),
                                rotation.getRemoteWeeksPerCycle(), onSiteDates, remoteDates);
                    }
                }
                currentDate = currentDate.plusDays(1);
            }
        } else {
            // No custom dates, use the automatic pattern for all dates
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                // Skip weekends
                if (currentDate.getDayOfWeek() != DayOfWeek.SATURDAY && currentDate.getDayOfWeek() != DayOfWeek.SUNDAY) {
                    addDateBasedOnPattern(currentDate, startDate, rotation.getCycleLengthWeeks(),
                            rotation.getRemoteWeeksPerCycle(), onSiteDates, remoteDates);
                }
                currentDate = currentDate.plusDays(1);
            }
        }

        return new AssociateCurrentRotationDTO(
                assignedRotation.getProject().getProjectId(),
                assignedRotation.getProject().getLabel(),
                onSiteDates,
                remoteDates
        );
    }

    // Helper method to determine if a date should be onsite or remote based on the pattern
    private void addDateBasedOnPattern(LocalDate date, LocalDate startDate, int cycleLengthWeeks,
                                       int remoteWeeksPerCycle, List<LocalDate> onSiteDates, List<LocalDate> remoteDates) {
        // Find which week this date belongs to
        LocalDate firstMondayAfterStart = startDate;
        while (firstMondayAfterStart.getDayOfWeek() != DayOfWeek.MONDAY) {
            firstMondayAfterStart = firstMondayAfterStart.plusDays(1);
        }

        long daysSinceFirstMonday = ChronoUnit.DAYS.between(firstMondayAfterStart, date);
        long weeksSinceStart = daysSinceFirstMonday / 7;

        // Calculate which week in the cycle this is
        int weekInCycle = (int) (weeksSinceStart % cycleLengthWeeks);

        // In each cycle, the first (cycleLengthWeeks - remoteWeeksPerCycle) weeks are onsite
        // and the remaining remoteWeeksPerCycle weeks are remote
        boolean isRemoteWeek = weekInCycle >= (cycleLengthWeeks - remoteWeeksPerCycle);

        if (isRemoteWeek) {
            remoteDates.add(date);
        } else {
            onSiteDates.add(date);
        }
    }
    // Fill in dates not explicitly set in custom dates using the automatic pattern
    private void fillMissingDatesWithPattern(Rotation rotation, List<LocalDate> onSiteDates, List<LocalDate> remoteDates) {
        LocalDate startDate = rotation.getStartDate();
        LocalDate endDate = rotation.getEndDate();
        int cycleLengthWeeks = rotation.getCycleLengthWeeks();
        int remoteWeeksPerCycle = rotation.getRemoteWeeksPerCycle();

        // Start from the first Monday on or after the start date
        LocalDate currentWeekStart = startDate;
        while (currentWeekStart.getDayOfWeek() != DayOfWeek.MONDAY) {
            currentWeekStart = currentWeekStart.plusDays(1);
        }

        // Process week by week
        while (!currentWeekStart.isAfter(endDate)) {
            long weeksSinceStart = ChronoUnit.WEEKS.between(startDate.with(DayOfWeek.MONDAY), currentWeekStart);
            int weekInCycle = (int) (weeksSinceStart % cycleLengthWeeks);

            boolean isRemoteWeek = weekInCycle >= (cycleLengthWeeks - remoteWeeksPerCycle);

            for (int i = 0; i < 5; i++) {
                LocalDate day = currentWeekStart.plusDays(i);
                if (!day.isBefore(startDate) && !day.isAfter(endDate)) {
                    // Only add if not already in either list (not explicitly set in custom dates)
                    if (!onSiteDates.contains(day) && !remoteDates.contains(day)) {
                        if (isRemoteWeek) {
                            remoteDates.add(day);
                        } else {
                            onSiteDates.add(day);
                        }
                    }
                }
            }

            currentWeekStart = currentWeekStart.plusWeeks(1);
        }
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
            Page<ActiveAssignedRotationProjection> assignedRotationPage = assignedRotationDomainRepository.findAllByRotationAssignmentStatusAndUser_SubFactory_SubFactoryId(RotationAssignmentStatus.ACTIVE, pageable, subFactoryId);

            return new PagedRotationsDTO(assignedRotationPage.toList(), assignedRotationPage.getTotalPages(), assignedRotationPage.getTotalElements(), usersRotationsBySubFactoryDTO.pageNumber(), usersRotationsBySubFactoryDTO.pageSize());
        }
        throw new SubFactoryNotFoundException("SubFactory not found ");
    }

//    @Override
//    public PagedRotationsDTO getUsersActiveRotations(PagedGlobalDTO globalDTO) {
//        Pageable pageable = PageRequest.of(globalDTO.pageNumber(), globalDTO.pageSize());
//        Page<ActiveAssignedRotationProjection> assignedRotationPage = assignedRotationDomainRepository.findAllByRotationAssignmentStatus(RotationAssignmentStatus.ACTIVE, pageable);
//
//        return new PagedRotationsDTO(assignedRotationPage.toList(), assignedRotationPage.getTotalPages(), assignedRotationPage.getTotalElements(), globalDTO.pageNumber(), globalDTO.pageSize());
//    }


    @Override
    public PagedAssignedRotationDTO getUsersRotationBySubFactory(UUID subFactoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AssignedRotation> assignedRotationPage =
                assignedRotationDomainRepository.findAllByUser_SubFactory_SubFactoryId(subFactoryId, pageable);

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

    /*@Override
    @Transactional
    public void updateRotationByDate(UpdateRotationDTO updateRotationDTO) {

        Long totalCapacity = subFactoryDomainRepository.TotalCapacity();
        Long dateCapacity=assignedRotationDomainRepository.countActiveRotationsForByDate(LocalDate.parse(updateRotationDTO.updatedDate()));



        if(updateRotationDTO.updatedStatus()== RotationStatus.ONSITE && dateCapacity>totalCapacity) throw new CapacityExceededException(updateRotationDTO.updatedDate());
        Rotation dbRotation = rotationDomainRepository.save(
                Rotation.builder()
                        .remoteWeeksPerCycle(updateRotationDTO.shift())
                        .cycleLengthWeeks(updateRotationDTO.cycle())
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
    }*/


    private boolean isDateInRange(Date date, Rotation rotation) {
        LocalDate localDate = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        return !localDate.isBefore(rotation.getStartDate()) &&
                !localDate.isAfter(rotation.getEndDate());
    }

    private void updateRotation(AssignedRotation assignedRotation, User rcUser) {
        assignedRotation.setRotationAssignmentStatus(RotationAssignmentStatus.OVERRIDDEN);
        assignedRotation.setUpdatedBy(rcUser);

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
                if( onSiteCapacity>totalCapacity) throw new CapacityExceededException("Total Capacity Exceeded : " + date.toString());
            }
        }
    }

    @Override
    @Transactional
    public RcAssignRotationUserDTO createRcAssignRotationAssociate(GlobalDTO globalDTO, RcAssignRotationUserDTO rcAssignRotationUserDTO) {
        User authenticatedRc = userDomainRepository.findById(globalDTO.userId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Long totalCapacity = subFactoryDomainRepository.TotalCapacity();

        // Validate rotation pattern parameters
        if (rcAssignRotationUserDTO.cycleLengthWeeks() < 1) {
            throw new IllegalArgumentException("Cycle length must be at least 1 week");
        }

        if (rcAssignRotationUserDTO.remoteWeeksPerCycle() < 0 ||
                rcAssignRotationUserDTO.remoteWeeksPerCycle() > rcAssignRotationUserDTO.cycleLengthWeeks()) {
            throw new IllegalArgumentException("Remote weeks must be between 0 and the cycle length");
        }

        // Check capacity for automatic rotation pattern
        checkAutoRotationCapacity(
                totalCapacity,
                rcAssignRotationUserDTO.remoteWeeksPerCycle(),
                rcAssignRotationUserDTO.cycleLengthWeeks(),
                LocalDate.parse(rcAssignRotationUserDTO.startDate()),
                LocalDate.parse(rcAssignRotationUserDTO.endDate()));

        // Check capacity for custom dates if provided
        if (rcAssignRotationUserDTO.customDates() != null && !rcAssignRotationUserDTO.customDates().isEmpty()) {
            checkCustomDatesCapacity(totalCapacity, rcAssignRotationUserDTO.customDates());
        }

        // Create and save the rotation
        Rotation dbRotation = rotationDomainRepository.save(Rotation.builder()
                .startDate(LocalDate.parse(rcAssignRotationUserDTO.startDate()))
                .endDate(LocalDate.parse(rcAssignRotationUserDTO.endDate()))
                .remoteWeeksPerCycle(rcAssignRotationUserDTO.remoteWeeksPerCycle())
                .cycleLengthWeeks(rcAssignRotationUserDTO.cycleLengthWeeks())
                .customDates(rcAssignRotationUserDTO.customDates())
                .build());

        // Find the project if provided
        Project dbProject = (rcAssignRotationUserDTO.projectId() != null)
                ? projectDomainRepository.findById(UUID.fromString(rcAssignRotationUserDTO.projectId()))
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"))
                : null;

        // Process each associate
        for (UUID associateId : rcAssignRotationUserDTO.associates()) {
            try {
                // Find the associate
                User associate = userDomainRepository.findById(associateId)
                        .orElseThrow(() -> new UserNotFoundException("Associate with ID " + associateId + " not found"));

                // Check if associate has an active rotation and update it
                try {
                    Optional<AssignedRotation> activeAssignedRotation =
                            assignedRotationDomainRepository.findByUser_UserIdAndRotationAssignmentStatus(
                                    associate.getUserId(), RotationAssignmentStatus.ACTIVE);

                    if (activeAssignedRotation.isPresent()) {
                        AssignedRotation overriddenAssignedRotation = activeAssignedRotation.get();
                        updateRotation(overriddenAssignedRotation, authenticatedRc);
                    }

                    // Create new assigned rotation
                    assignedRotationDomainRepository.save(AssignedRotation.builder()
                            .assignedRotationId(new AssignedRotationId(associate.getUserId(), dbRotation.getRotationId()))
                            .user(associate)
                            .rotation(dbRotation)
                            .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                            .project(dbProject)
                            .createdAt(LocalDateTime.now())
                            .createdBy(authenticatedRc)
                            .build());

                } catch (IncorrectResultSizeDataAccessException e) {
                    // Log the error with more details
                    throw new RuntimeException("Error processing rotation for associate: " + e.getMessage(), e);
                }
            } catch (UserNotFoundException e) {
                // Log the error and continue with other associates
            }
        }
        simpMessagingTemplate.convertAndSend("/topic/rotation","changed");
        return rcAssignRotationUserDTO;
    }
    @Override
    public RcCountCurrentAssociateOnSiteDTO getRcCountCurrentAssociateOnSite() {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY); // start of current week
        LocalDate friday = monday.plusDays(4); // end of current week

        // Limit DB call to 8
        Pageable limit8 = PageRequest.of(0, 8, Sort.by("createdAt").descending());
        List<AssignedRotation> activeRotations = assignedRotationDomainRepository
                .findAllByRotationAssignmentStatus(RotationAssignmentStatus.ACTIVE, limit8)
                .getContent();

        Set<UUID> onsiteUserIds = activeRotations.stream()
                .collect(Collectors.groupingBy(ar -> ar.getUser().getUserId()))
                .entrySet()
                .stream()
                .filter(entry -> {
                    List<AssignedRotation> userRotations = entry.getValue();
                    return userRotations.stream().anyMatch(ar -> {
                        Rotation rotation = ar.getRotation();
                        if (rotation == null || rotation.getStartDate() == null || rotation.getEndDate() == null) {
                            return false;
                        }

                        Map<LocalDate, RotationStatus> customMap = rotation.getCustomDates() != null
                                ? rotation.getCustomDates().stream()
                                .collect(Collectors.toMap(
                                        CustomDate::getDate,
                                        CustomDate::getRotationStatus,
                                        (a, b) -> a))
                                : Collections.emptyMap();

                        for (int i = 0; i < 5; i++) {
                            LocalDate currentDay = monday.plusDays(i);

                            if (currentDay.isBefore(rotation.getStartDate()) || currentDay.isAfter(rotation.getEndDate())) {
                                continue;
                            }

                            RotationStatus override = customMap.get(currentDay);
                            if (override != null) {
                                if (override == RotationStatus.ONSITE) return true;
                                continue;
                            }

                            long weeksSinceStart = ChronoUnit.DAYS.between(rotation.getStartDate(), currentDay) / 7;
                            int cycleLength = rotation.getCycleLengthWeeks();
                            int remoteWeeks = rotation.getRemoteWeeksPerCycle();

                            if (cycleLength > 0 && (weeksSinceStart % cycleLength) >= remoteWeeks) {
                                return true;
                            }
                        }

                        return false;
                    });
                })
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());

        return assignedRotationMapper.toRcCountCurrentAssociateOnSite((long) onsiteUserIds.size());
    }

    @Override
    public List<RcRecentAssociateRotations> getRcRecentAssociateRotations() {
        PageRequest pageRequest = PageRequest.of(0, 10, Sort.by("createdAt").descending());
        List<AssignedRotation> assignments = assignedRotationDomainRepository.findAllByRotationAssignmentStatus(RotationAssignmentStatus.ACTIVE, pageRequest).getContent();

        List<RcRecentAssociateRotations> results = new ArrayList<>();

        for (AssignedRotation assigned : assignments) {
            User user = assigned.getUser();
            Rotation rotation = assigned.getRotation();

            LocalDate startDate = rotation.getStartDate();
            LocalDate endDate = rotation.getEndDate();

            LocalDate startOfWeekDate=startDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
            int cycleLengthWeeks = rotation.getCycleLengthWeeks();
            int remoteWeeksPerCycle = rotation.getRemoteWeeksPerCycle();

            // Collect override dates from rotation.customDates
            Set<LocalDate> overrideRemoteDates = rotation.getCustomDates().stream()
                    .filter(cd -> cd.getRotationStatus() == RotationStatus.REMOTE)
                    .map(CustomDate::getDate)
                    .collect(Collectors.toSet());

            Set<LocalDate> overrideOnsiteDates = rotation.getCustomDates().stream()
                    .filter(cd -> cd.getRotationStatus() == RotationStatus.ONSITE)
                    .map(CustomDate::getDate)
                    .collect(Collectors.toSet());

            List<LocalDate> onSiteDates = new ArrayList<>();
            List<LocalDate> remoteDates = new ArrayList<>();

            for (LocalDate current = startDate; !current.isAfter(endDate); current = current.plusDays(1)) {
                if (overrideRemoteDates.contains(current)) {
                    remoteDates.add(current);
                } else if (overrideOnsiteDates.contains(current)) {
                    onSiteDates.add(current);
                } else {
                    long daysSinceStart = ChronoUnit.DAYS.between(startOfWeekDate, current);
                    int weeksSinceStart = (int) (daysSinceStart / 7);
                    int weekInCycle = weeksSinceStart % cycleLengthWeeks;

                    boolean isRemote = weekInCycle < remoteWeeksPerCycle;

                    if (isRemote) {
                        remoteDates.add(current);
                    } else {
                        onSiteDates.add(current);
                    }
                }
            }

            RcRecentAssociateRotations result = RcRecentAssociateRotations.builder()
                    .rotationId(assigned.getRotation().getRotationId())
                    .userId(user.getUserId())
                    .fullName(user.getFirstName() + " " + user.getLastName())
                    .onSiteDates(onSiteDates)
                    .remoteDates(remoteDates)
                    .build();

            results.add(result);
        }

        return results;
    }

    @Override
    public PagedRcRecentAssociateRotations getRcAllRecentAssociateRotations(PagedRotationsSearchDTO pagedRotationsSearchDTO) {
        PageRequest pageRequest = PageRequest.of(
                pagedRotationsSearchDTO.pageNumber(),
                pagedRotationsSearchDTO.pageSize(),
                Sort.by("createdAt").descending());

        Specification<AssignedRotation> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always filter active rotations
            predicates.add(cb.equal(root.get("rotationAssignmentStatus"), RotationAssignmentStatus.ACTIVE));

            // Join with user
            Join<AssignedRotation, User> userJoin = root.join("user");
            Join<AssignedRotation, Rotation> rotationJoin = root.join("rotation");
            Join<AssignedRotation, Project> projectJoin = root.join("project",JoinType.LEFT);

            if (pagedRotationsSearchDTO.label() != null && !pagedRotationsSearchDTO.label().isBlank()) {
                Expression<String> firstName = cb.lower(userJoin.get("firstName"));
                Expression<String> lastName = cb.lower(userJoin.get("lastName"));

                // Create full name expression: lower(first_name || ' ' || last_name)
                Expression<String> fullNameExpression = cb.concat(cb.concat(firstName, cb.literal(" ")), lastName);

                String search = "%" + pagedRotationsSearchDTO.label().toLowerCase().trim() + "%";

                predicates.add(cb.like(fullNameExpression, search));
            }

            if (pagedRotationsSearchDTO.clientId() != null) {
                predicates.add(cb.equal(projectJoin.get("owner").get("clientId"), pagedRotationsSearchDTO.clientId()));
            }

            if (pagedRotationsSearchDTO.projectId() != null) {
                predicates.add(cb.equal(root.get("project").get("projectId"), pagedRotationsSearchDTO.projectId()));
            }

            if (pagedRotationsSearchDTO.factoryId() != null) {
                predicates.add(cb.equal(userJoin.get("subFactory").get("factory").get("factoryId"), pagedRotationsSearchDTO.factoryId()));
            }

            if (pagedRotationsSearchDTO.subFactoryId() != null) {
                predicates.add(cb.equal(userJoin.get("subFactory").get("subFactoryId"), pagedRotationsSearchDTO.subFactoryId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<AssignedRotation> assignments = assignedRotationDomainRepository.findAll(spec, pageRequest);

        List<RcRecentAssociateRotations> results = new ArrayList<>();

        for (AssignedRotation assigned : assignments.getContent()) {
            User user = assigned.getUser();
            Rotation rotation = assigned.getRotation();

            LocalDate startDate = rotation.getStartDate();
            LocalDate endDate = rotation.getEndDate();

            int cycleLengthWeeks = rotation.getCycleLengthWeeks();
            int remoteWeeksPerCycle = rotation.getRemoteWeeksPerCycle();

            Set<LocalDate> overrideRemoteDates = rotation.getCustomDates().stream()
                    .filter(cd -> cd.getRotationStatus() == RotationStatus.REMOTE)
                    .map(CustomDate::getDate)
                    .collect(Collectors.toSet());

            Set<LocalDate> overrideOnsiteDates = rotation.getCustomDates().stream()
                    .filter(cd -> cd.getRotationStatus() == RotationStatus.ONSITE)
                    .map(CustomDate::getDate)
                    .collect(Collectors.toSet());

            List<LocalDate> onSiteDates = new ArrayList<>();
            List<LocalDate> remoteDates = new ArrayList<>();

            for (LocalDate current = startDate; !current.isAfter(endDate); current = current.plusDays(1)) {
                if (overrideRemoteDates.contains(current)) {
                    remoteDates.add(current);
                } else if (overrideOnsiteDates.contains(current)) {
                    onSiteDates.add(current);
                } else {
                    long daysSinceStart = ChronoUnit.DAYS.between(startDate, current);
                    int weeksSinceStart = (int) (daysSinceStart / 7);
                    int weekInCycle = weeksSinceStart % cycleLengthWeeks;

                    boolean isRemote = weekInCycle < remoteWeeksPerCycle;
                    if (isRemote) {
                        remoteDates.add(current);
                    } else {
                        onSiteDates.add(current);
                    }
                }
            }

            RcRecentAssociateRotations result = RcRecentAssociateRotations.builder()
                    .rotationId(rotation.getRotationId())
                    .userId(user.getUserId())
                    .fullName(user.getFirstName() + " " + user.getLastName())
                    .onSiteDates(onSiteDates)
                    .remoteDates(remoteDates)
                    .build();

            results.add(result);
        }

        return new PagedRcRecentAssociateRotations(
                results,
                assignments.getTotalPages(),
                assignments.getTotalElements(),
                pagedRotationsSearchDTO.pageNumber() + 1,
                pagedRotationsSearchDTO.pageSize());
    }

    @Override
    public Boolean updateRcAssignedRotationAssociate(GlobalDTO globalDTO, RcUpdateAssociateRotationDTO rcUpdateAssociateRotationDTO) {
        // Validate authenticated user

        User authenticatedRc = userDomainRepository.findById(globalDTO.userId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Long totalCapacity = subFactoryDomainRepository.TotalCapacity();

        // Find the active rotation assignment for the user
        AssignedRotation currentAssignedRotation = assignedRotationDomainRepository
                .findByUser_UserIdAndRotationAssignmentStatus(rcUpdateAssociateRotationDTO.userId(), RotationAssignmentStatus.ACTIVE)
                .orElseThrow();

        // Get the existing rotation
        Rotation existingRotation = currentAssignedRotation.getRotation();

        // Validate rotation pattern parameters
        if (existingRotation.getCycleLengthWeeks() < 1) {
            throw new IllegalArgumentException("Cycle length must be at least 1 week");
        }

        if (existingRotation.getRemoteWeeksPerCycle() < 0 ||
                existingRotation.getRemoteWeeksPerCycle() > existingRotation.getCycleLengthWeeks()) {
            throw new IllegalArgumentException("Remote weeks must be between 0 and the cycle length");
        }

        // Process custom dates - create a map of dates to efficiently update them
        Map<LocalDate, CustomDate> dateMap = new HashMap<>();

        // First add all existing custom dates to the map
        if (existingRotation.getCustomDates() != null) {
            for (CustomDate customDate : existingRotation.getCustomDates()) {
                dateMap.put(customDate.getDate(), customDate);
            }
        }

        // Then update or add new custom dates from the request
        if (rcUpdateAssociateRotationDTO.customDates() != null) {
            for (CustomDate newCustomDate : rcUpdateAssociateRotationDTO.customDates()) {
                // This will either add a new date or replace an existing one
                dateMap.put(newCustomDate.getDate(), newCustomDate);
            }
        }

        // Convert the map back to a list
        List<CustomDate> mergedCustomDates = new ArrayList<>(dateMap.values());

        // Check capacity for automatic rotation pattern
        checkAutoRotationCapacity(
                totalCapacity,
                existingRotation.getRemoteWeeksPerCycle(),
                existingRotation.getCycleLengthWeeks(),
                existingRotation.getStartDate(),
                existingRotation.getEndDate());

        // Check capacity for custom dates
        if (!mergedCustomDates.isEmpty()) {
            checkCustomDatesCapacity(totalCapacity, mergedCustomDates);
        }

        // Create a new rotation based on the existing one but with updated custom dates
        Rotation newRotation = rotationDomainRepository.save(Rotation.builder()
                .startDate(existingRotation.getStartDate())
                .endDate(existingRotation.getEndDate())
                .remoteWeeksPerCycle(existingRotation.getRemoteWeeksPerCycle())
                .cycleLengthWeeks(existingRotation.getCycleLengthWeeks())
                .customDates(mergedCustomDates)
                .build());

        // Find the project if provided
        Project dbProject = (currentAssignedRotation.getProject() != null && currentAssignedRotation.getProject().getProjectId() != null)
                ? projectDomainRepository.findById(currentAssignedRotation.getProject().getProjectId())
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"))
                : null;

        // Find the associate user
        User associate = userDomainRepository.findById(rcUpdateAssociateRotationDTO.userId())
                .orElseThrow(() -> new UserNotFoundException("Associate with ID " + rcUpdateAssociateRotationDTO.userId() + " not found"));

        // Deactivate the current rotation assignment
        updateRotation(currentAssignedRotation, authenticatedRc);

        // Create new assigned rotation
        assignedRotationDomainRepository.save(AssignedRotation.builder()
                .assignedRotationId(new AssignedRotationId(associate.getUserId(), newRotation.getRotationId()))
                .user(associate)
                .rotation(newRotation)
                .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                .project(dbProject)
                .createdAt(LocalDateTime.now())
                .createdBy(authenticatedRc)
                .build());
        simpMessagingTemplate.convertAndSend("/topic/rotation",Map.of("code","ROTATION_UPDATED"));
        return true;
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
