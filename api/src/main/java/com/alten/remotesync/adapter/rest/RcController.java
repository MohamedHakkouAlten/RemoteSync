package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import com.alten.remotesync.application.assignedRotation.record.request.*;
import com.alten.remotesync.application.assignedRotation.record.response.*;
import com.alten.remotesync.application.assignedRotation.service.AssignedRotationService;
import com.alten.remotesync.application.client.record.response.ClientDropDownDTO;
import com.alten.remotesync.application.client.service.ClientService;
import com.alten.remotesync.application.factory.record.response.FactoryDropDownDTO;
import com.alten.remotesync.application.factory.record.response.RcFactoriesCountDTO;
import com.alten.remotesync.application.factory.service.FactoryService;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.project.record.response.ProjectDTO;
import com.alten.remotesync.application.project.record.response.RcProjectsCountDTO;
import com.alten.remotesync.application.project.service.ProjectService;

import com.alten.remotesync.application.report.record.request.*;
import com.alten.remotesync.application.report.record.response.PagedReportDTO;
import com.alten.remotesync.application.report.service.ReportService;
import com.alten.remotesync.application.subFactory.record.response.RcSubFactoriesCapacityCountDTO;
import com.alten.remotesync.application.subFactory.service.SubFactoryService;
import com.alten.remotesync.application.user.record.response.RcSearchAssociateDTO;
import com.alten.remotesync.application.user.service.UserService;
import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class RcController {
    private final ProjectService projectService;
    private final AssignedRotationService assignedRotationService;
    private final ReportService reportService;
    private final UserService userService;
    private final ClientService clientService;
    private final FactoryService factoryService;
    private final SubFactoryService subFactoryService;

    @GetMapping("/rc/dashboard")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcDashboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        RcProjectsCountDTO rcCompletedRcProjectsCountDTO = projectService.getRcCountProjectByStatus(ProjectStatus.COMPLETED);
        RcProjectsCountDTO rcActiveRcProjectsCountDTO = projectService.getRcCountProjectByStatus(ProjectStatus.ACTIVE);
        RcFactoriesCountDTO rcFactoriesCountDTO = factoryService.getRcTotalFactoriesCount();
        RcSubFactoriesCapacityCountDTO rcSubFactoriesCapacityCountDTO = subFactoryService.getRcSubFactoriesTotalCapacity();
        RcCountCurrentAssociateOnSiteDTO rcCountCurrentAssociateOnSiteDTO = assignedRotationService.getRcCountCurrentAssociateOnSite();
        ProjectDTO longestDurationProjectDTO = projectService.getRcLongestDurationProject();
        ProjectDTO largestTeamProjectDTO = projectService.getRcLargestTeamProject();
        PagedReportDTO pendingReports = reportService.getRcPendingReports();
        List<RcRecentAssociateRotations> recentAssociateRotations = assignedRotationService.getRcRecentAssociateRotations();

        Map<String, Object> data = new HashMap<>();
        data.put("completedProjectsCount", rcCompletedRcProjectsCountDTO.projectsCount());
        data.put("activeProjectsCount", rcActiveRcProjectsCountDTO.projectsCount());
        data.put("factoriesCount", rcFactoriesCountDTO.factoriesCount());
        data.put("capacityCount", rcSubFactoriesCapacityCountDTO.subFactoriesCount());
        data.put("countCurrentAssociateOnSite", rcCountCurrentAssociateOnSiteDTO.countCurrentAssociateOnSite());
        data.put("longestDurationProject", longestDurationProjectDTO);
        data.put("largestTeamProject", largestTeamProjectDTO);
        data.put("pendingReports", pendingReports);
        data.put("recentAssociateRotations", recentAssociateRotations);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(data
                                , HttpStatus.OK));
    }

    @GetMapping("/rc/reports")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcReports(@AuthenticationPrincipal UserPrincipal userPrincipal, @ModelAttribute PagedReportSearchDTO pagedReportSearchDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(reportService.getRcReports(pagedReportSearchDTO)
                        , HttpStatus.OK));
    }

    @PutMapping("/rc/reports/update")
    @PreAuthorize("hasAuthority('RC:WRITE')")
    public ResponseEntity<?> updateReportStatus(@RequestBody RcUpdateReportDTO rcUpdateReportDTO) {
        System.out.println(rcUpdateReportDTO.reportId());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.rcUpdateReportStatus(rcUpdateReportDTO), HttpStatus.OK));
    }

    @GetMapping("/rc/initial-calendar")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcInitialCalendar(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ClientDropDownDTO> clientDropDownDTOS = clientService.getRcAllClients();
        List<FactoryDropDownDTO> factoryDropDownDTOS = factoryService.getRcAllFactories();
        List<RcRecentAssociateRotations> recentAssociateRotations = assignedRotationService.getRcRecentAssociateRotations();

        Map<String, Object> data = new HashMap<>();
        data.put("clientDropDown", clientDropDownDTOS);
        data.put("factoryDropDown", factoryDropDownDTOS);
        data.put("allRecentAssociateRotations", recentAssociateRotations);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(data
                                , HttpStatus.OK));
    }

    @GetMapping("/rc/rotations")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcUsersActiveRotation(@AuthenticationPrincipal UserPrincipal userPrincipal, @ModelAttribute PagedRotationsSearchDTO pagedRotationsSearchDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(assignedRotationService.getRcAllRecentAssociateRotations(
                        pagedRotationsSearchDTO),
                        HttpStatus.OK));
    }

    @GetMapping("/rc/projects/{clientId}")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcProjectsByClient(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("clientId") UUID clientId) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(
                        projectService.getRcAllProjectsByClient(GlobalDTO.fromClientId(clientId)),
                        HttpStatus.OK
                ));
    }

    @GetMapping("/rc/sub-factories/{factoryId}")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcSubFactoriesByFactory(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("factoryId") UUID facotryId) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(
                        subFactoryService.getRcAllSubFactoriesByFactory(GlobalDTO.fromFactoryId(facotryId)),
                        HttpStatus.OK
                ));
    }

    @GetMapping("/rc/projects")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcProjects(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(
                        projectService.getRcAllProjects(),
                        HttpStatus.OK
                ));
    }

    @GetMapping("/rc/associates")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcAssociates(@AuthenticationPrincipal UserPrincipal userPrincipal, @ModelAttribute RcSearchAssociateDTO rcSearchAssociateDTO) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(userService.getRcAllAssociatesWithoutAssignedRotation(rcSearchAssociateDTO), // RETURN USERS WHO DON'T HAVE ANY ASSIGNED ROTATION
                        HttpStatus.OK));
    }

    @PostMapping("/rc/rotations/create")
    @PreAuthorize("hasAuthority('RC:WRITE')")
    public ResponseEntity<?> createRcAssignRotation(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody RcAssignRotationUserDTO rcAssignRotationUserDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(assignedRotationService.createRcAssignRotationAssociate(GlobalDTO.fromUserId(userPrincipal.userId()),
                                rcAssignRotationUserDTO),
                        HttpStatus.OK));
    }

    @PutMapping("/rc/rotation/update")
    @PreAuthorize("hasAuthority('RC:WRITE')")
    public ResponseEntity<?> updateRcAssignedRotation(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody RcUpdateAssociateRotationDTO rcUpdateAssociateRotationDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(assignedRotationService.updateRcAssignedRotationAssociate(GlobalDTO.fromUserId(userPrincipal.userId()),
                                rcUpdateAssociateRotationDTO),
                        HttpStatus.OK));
    }















































//    @GetMapping("/rc/projects")
//    @PreAuthorize("hasAuthority('RC:READ')")
//    public ResponseEntity<?> getProjects(@AuthenticationPrincipal UserPrincipal userPrincipal, @ModelAttribute PagedGlobalDTO pagedGlobalDTO) {
//        return ResponseEntity
//                .status(HttpStatus.OK)
//                .body(ResponseWrapper.success(
//                        projectService.getProjects(GlobalDTO.fromUserId(userPrincipal.userId()), pagedGlobalDTO),
//                        HttpStatus.OK
//                ));
//    }

    @GetMapping("/projects/count")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> countActiveProjects(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(
                        projectService.countActiveProjects(),
                        HttpStatus.OK
                ));
    }

    @GetMapping("/projects/largest-team")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getLargestTeamProject(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(
                        projectService.getRcLargestTeamProject(),
                        HttpStatus.OK
                ));
    }

    @GetMapping("/projects/canceled/count")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> countCancelledProjects(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(
                        projectService.countCancelledProjects(),
                        HttpStatus.OK
                ));
    }
    @GetMapping("/rc/rotations/sub-factory/{subFactoryId}/{page}/{size}")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRotationsBySubFactory(@PathVariable UUID subFactoryId,
                                                      @PathVariable int page,
                                                      @PathVariable int size) {
        return ResponseEntity.ok(
                ResponseWrapper.success(
                        assignedRotationService.getUsersRotationBySubFactory(subFactoryId, page, size),
                        HttpStatus.OK
                )
        );
    }

    /*@GetMapping("/rc/reports")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRCReports(@ModelAttribute PagedGlobalDTO globalDTO) {


        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.getRCReports(globalDTO), HttpStatus.OK));
    }*/
    @GetMapping("/rc/reports/byStatus")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRCReportsByStatus(@ModelAttribute RCReportByStatusDTO rcReportByStatusDTO) {


        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.getRCReportsByStatus(rcReportByStatusDTO), HttpStatus.OK));
    }
    @GetMapping("/rc/reports/byDateRange")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRCReportsByDateRange(@ModelAttribute RCReportByDateRangeDTO rcReportByDateRangeDTO) {

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.getRCReportsByDateRange(rcReportByDateRangeDTO), HttpStatus.OK));
    }
    @GetMapping("/rc/reports/byName")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRCReportsByName(@ModelAttribute RCReportByUserDTO rcReportByUserDTO) {

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.getRCReportsByUser(rcReportByUserDTO), HttpStatus.OK));
    }
    @GetMapping("/rc/rotations/client/{clientId}/{pageNumber}/{pageSize}")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersRotationByClient(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID clientId,
            @PathVariable @Min(0) Integer pageNumber,
            @PathVariable @Min(1) Integer pageSize) {

        PagedAssignedRotationDTO response = assignedRotationService.getUsersRotationByClient(clientId, pageNumber, pageSize);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(response, HttpStatus.OK));
    }

//    @GetMapping("/rotations")
//    @PreAuthorize("hasAuthority('RC:READ')")
//    public ResponseEntity<?> getUsersActiveRotation(
//           @ModelAttribute PagedGlobalDTO globalDTO
//            ) {
//
//        PagedRotationsDTO response = assignedRotationService.getUsersActiveRotations(globalDTO);
//        return ResponseEntity
//                .status(HttpStatus.OK)
//                .body(ResponseWrapper.success(response, HttpStatus.OK));
//    }
//    @GetMapping("/rc/projects/byLabel")
//    @PreAuthorize("hasAuthority('RC:READ')")
//    public ResponseEntity<?> getRcProjectsByLabel(
//            @RequestParam
//            @Size(max = 20, message = "Label must not exceed 20 characters")
//         String label
//    ) {
//        System.out.println(label);
//        return ResponseEntity
//                .status(HttpStatus.OK)
//                .body(ResponseWrapper.success(projectService.getRcProjectsByLabel(label), HttpStatus.OK));
//    }
    @GetMapping("/rc/clients/byLabel")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcClientsByLabel(
            @RequestParam
            @Size(max = 20, message = "Label must not exceed 20 characters")
            String label
    ) {
        System.out.println(label);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(clientService.getClientsListByLabel(label), HttpStatus.OK));
    }
    @GetMapping("/rc/factories")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcFactories(
            ) {

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(factoryService.getRcFactories(), HttpStatus.OK));
    }
    @GetMapping("/rc/subFactories")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcSubFactories(

    ) {

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(subFactoryService.getRcSubFactories(), HttpStatus.OK));
    }
    @GetMapping("/rc/users/byName")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcUsersByName(
            @RequestParam
            @Size(max = 20, message = "Label must not exceed 20 characters")
            String name
    ) {
        System.out.println(name);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(userService.getRCUsersByName(name), HttpStatus.OK));
    }

    /*
    @PutMapping("/rc/rotations/updateRotation")
    @PreAuthorize("hasAuthority('RC:WRITE')")
    public ResponseEntity<?> updateRotationByDate(
            @RequestBody UpdateRotationDTO updateRotationDTO
    ) {
        System.out.println(updateRotationDTO);
        assignedRotationService.updateRotationByDate(updateRotationDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success("Rotation updated successfully", HttpStatus.OK));
    }*/

    @GetMapping("/rc/rotations/byName")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersActiveRotationByName(
            @ModelAttribute  UsersRotationsByNameDTO usersRotationsByNameDTO
            ) {
        System.out.println(usersRotationsByNameDTO);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(assignedRotationService.getUsersActiveRotationsByName(usersRotationsByNameDTO), HttpStatus.OK));
    }
    @GetMapping("/rc/rotations/byProject")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersActiveRotationByProject(
  @ModelAttribute UsersRotationsByProjectDTO usersRotationsByProjectDTO
            ) {

        PagedRotationsDTO response = assignedRotationService.getUsersActiveRotationsByProject(usersRotationsByProjectDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(response, HttpStatus.OK));
    }
    @GetMapping("/rc/rotations/byClient")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersActiveRotationByClient(

            @ModelAttribute UsersRotationsByClientDTO usersRotationsByClientDTO
    ) {
        PagedRotationsDTO response = assignedRotationService.getUsersActiveRotationsByClient(usersRotationsByClientDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(response, HttpStatus.OK));
    }
    @GetMapping("/rc/rotations/byFactory")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersActiveRotationByFactory(

            @ModelAttribute UsersRotationsByFactoryDTO usersRotationsByFactoryDTO
    ) {
        PagedRotationsDTO response = assignedRotationService.getUsersActiveRotationsByFactory(usersRotationsByFactoryDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(response, HttpStatus.OK));
    }
    @GetMapping("/rc/rotations/bySubFactory")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersActiveRotationBySubFactory(

            @ModelAttribute UsersRotationsBySubFactoryDTO usersRotationsBySubFactoryDTO
    ) {
        PagedRotationsDTO response = assignedRotationService.getUsersActiveRotationsBySubFactory(usersRotationsBySubFactoryDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(response, HttpStatus.OK));
    }



}
