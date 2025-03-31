package com.alten.remotesync.application.assignedRotation.service;

import com.alten.remotesync.adapter.exception.assignedRotation.AssignedRotationNotFoundException;
import com.alten.remotesync.application.assignedRotation.mapper.AssignedRotationMapper;
import com.alten.remotesync.application.assignedRotation.record.response.AssignedRotationDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.assignedRotation.repository.AssignedRotationDomainRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

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

    @Override
    public AssignedRotationDTO getAssociateCurrentRotationWithoutProject(GlobalDTO globalDTO) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        AssignedRotation assignedRotations = assignedRotationDomainRepository.findAssignedRotationByUser_UserIdAndProjectIsNullAndRotationAssignmentStatus(
                globalDTO.userId(),
                RotationAssignmentStatus.ACTIVE,
                sort).orElseThrow(() -> new AssignedRotationNotFoundException("Assigned Rotation Not Found"));

        return assignedRotationMapper.toAssignedRotationDTO(assignedRotations);
    }
}
