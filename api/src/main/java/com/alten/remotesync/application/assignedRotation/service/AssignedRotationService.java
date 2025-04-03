package com.alten.remotesync.application.assignedRotation.service;

import com.alten.remotesync.application.assignedRotation.record.response.AssignedRotationDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import org.springframework.stereotype.Service;

@Service
public interface AssignedRotationService {
    AssignedRotationDTO getAssociateCurrentRotationWithProject(GlobalDTO globalDTO);
    AssignedRotationDTO getAssociateCurrentRotationWithoutProject(GlobalDTO globalDTO);
}
