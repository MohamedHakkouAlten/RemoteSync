package com.alten.remotesync.application.assignedRotation.service;

import com.alten.remotesync.application.assignedRotation.record.request.*;
import com.alten.remotesync.application.assignedRotation.record.response.*;
import com.alten.remotesync.application.client.record.response.ClientDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface AssignedRotationService {
    List<ClientDTO> getAssociateClients(GlobalDTO globalDTO);
    OnSiteWeeksDTO getAssociateOnSiteWeeks(GlobalDTO globalDTO);
    AssociateCurrentRotationDTO getAssociateCurrentRotation(GlobalDTO globalDTO);
    PagedRotationsDTO getUsersActiveRotationsByName(UsersRotationsByNameDTO usersRotationsByNameDTO);
    PagedRotationsDTO getUsersActiveRotationsByProject(UsersRotationsByProjectDTO usersRotationsByProjectDTO);
    PagedRotationsDTO getUsersActiveRotationsByClient(UsersRotationsByClientDTO usersRotationsByClientDTO);
    PagedRotationsDTO getUsersActiveRotationsByFactory(UsersRotationsByFactoryDTO usersRotationsByFactoryDTO);
    PagedRotationsDTO getUsersActiveRotationsBySubFactory(UsersRotationsBySubFactoryDTO usersRotationsBySubFactoryDTO);
    PagedAssignedRotationDTO getUsersRotationBySubFactory(UUID subFactoryId, int page, int size);
    //void updateRotationByDate(UpdateRotationDTO updateRotationDTO);
    PagedAssignedRotationDTO getUsersRotationByClient(UUID clientId, int page, int size);
    RcAssignRotationUserDTO createRcAssignRotationAssociate(GlobalDTO globalDTO, RcAssignRotationUserDTO rcAssignRotationUserDTO);
    RcCountCurrentAssociateOnSiteDTO getRcCountCurrentAssociateOnSite();
    List<RcRecentAssociateRotations> getRcRecentAssociateRotations();
    PagedRcRecentAssociateRotations getRcAllRecentAssociateRotations(PagedRotationsSearchDTO pagedRotationsSearchDTO);

    Boolean updateRcAssignedRotationAssociate(GlobalDTO globalDTO, RcUpdateAssociateRotationDTO rcUpdateAssociateRotationDTO);
}
