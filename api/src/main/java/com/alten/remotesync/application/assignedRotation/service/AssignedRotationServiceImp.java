package com.alten.remotesync.application.assignedRotation.service;

import com.alten.remotesync.adapter.exception.assignedRotation.AssignedRotationNotFoundException;
import com.alten.remotesync.application.assignedRotation.mapper.AssignedRotationMapper;
import com.alten.remotesync.application.assignedRotation.record.response.AssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.response.PagedAssignedRotationDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.assignedRotation.repository.AssignedRotationDomainRepository;

import com.alten.remotesync.domain.rotation.model.Rotation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AssignedRotationServiceImp implements AssignedRotationService {
    private final AssignedRotationDomainRepository assignedRotationDomainRepository;
    private final AssignedRotationMapper assignedRotationMapper;

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
            if (isDateInRange(date, assignedRotation.getRotation())) {
                updateRotation(assignedRotation);
            }
        }
    }

    private boolean isDateInRange(Date date, Rotation rotation) {
        return !date.before(rotation.getStartDate()) && !date.after(rotation.getEndDate());
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
}
