package com.alten.remotesync.application.assignedRotation.service;

import com.alten.remotesync.application.assignedRotation.record.request.*;
import com.alten.remotesync.application.assignedRotation.record.response.AssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.response.PagedAssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.response.PagedRotationsDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
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
    PagedRotationsDTO getUsersActiveRotationsByName(UsersRotationsByNameDTO usersRotationsByNameDTO);
    PagedRotationsDTO getUsersActiveRotationsByProject(UsersRotationsByProjectDTO usersRotationsByProjectDTO);
    PagedRotationsDTO getUsersActiveRotationsByClient(UsersRotationsByClientDTO usersRotationsByClientDTO);
    PagedRotationsDTO getUsersActiveRotationsByFactory(UsersRotationsByFactoryDTO usersRotationsByFactoryDTO);
    PagedRotationsDTO getUsersActiveRotationsBySubFactory(UsersRotationsBySubFactoryDTO usersRotationsBySubFactoryDTO);
    PagedRotationsDTO getUsersActiveRotations(PagedGlobalDTO globalDTO);
    PagedAssignedRotationDTO getUsersRotationBySubFactory(UUID subFactoryId, int page, int size);
    void updateRotationByDate(UpdateRotationDTO updateRotationDTO);
    PagedAssignedRotationDTO getUsersRotationByClient(UUID clientId, int page, int size);
    CreateAssignedRotationDTO createAssignedRotation(CreateAssignedRotationDTO createAssignedRotationDTO);
    Long currentWeekOnSiteAssociatesCount();
}
