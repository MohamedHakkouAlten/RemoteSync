package com.alten.remotesync.application.assignedRotation.service;

import com.alten.remotesync.application.assignedRotation.record.response.AssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.response.PagedAssignedRotationDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public interface AssignedRotationService {
    AssignedRotationDTO getAssociateCurrentRotationWithProject(GlobalDTO globalDTO);
    List<AssignedRotationDTO> getAssociateOldRotationsWithProject(GlobalDTO globalDTO); // NEED REWORK (PAGEABLE IF POSSIBLE IN THE FUTURE)
    AssignedRotationDTO getAssociateCurrentRotationWithoutProject(GlobalDTO globalDTO);
    List<AssignedRotationDTO> getAssociateOldRotationsWithoutProject(GlobalDTO globalDTO); // NEED REWORK (PAGEABLE IF POSSIBLE IN THE FUTURE)
    Float onSiteAssociatesPercentage();
    PagedAssignedRotationDTO getUsersRotationBySubFactory(UUID subFactoryId, int page, int size);
    void updateRotationByDate(UUID userId, Date date);
    PagedAssignedRotationDTO getUsersRotationByClient(UUID clientId, int page, int size);
}
