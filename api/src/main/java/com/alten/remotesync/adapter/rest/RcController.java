package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import com.alten.remotesync.application.assignedRotation.record.request.*;
import com.alten.remotesync.application.assignedRotation.record.response.PagedAssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.response.PagedRotationsDTO;
import com.alten.remotesync.application.assignedRotation.service.AssignedRotationService;
import com.alten.remotesync.application.client.service.ClientService;
import com.alten.remotesync.application.factory.record.response.RCDashBoardDTO;
import com.alten.remotesync.application.factory.service.FactoryService;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
import com.alten.remotesync.application.project.service.ProjectService;

import com.alten.remotesync.application.report.record.request.RCReportByDateRangeDTO;
import com.alten.remotesync.application.report.record.request.RCReportByStatusDTO;
import com.alten.remotesync.application.report.record.request.RCReportByUserDTO;
import com.alten.remotesync.application.report.record.request.RCUpdateReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.application.report.service.ReportService;
import com.alten.remotesync.application.subFactory.service.SubFactoryService;
import com.alten.remotesync.application.user.service.UserService;
import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user/rc")
@RequiredArgsConstructor
public class RcController {

    private final ProjectService projectService;
    private final AssignedRotationService assignedRotationService;
    private final ReportService reportService;
    private final UserService userService;
    private final ClientService clientService;
    private final FactoryService factoryService;
    private final SubFactoryService subFactoryService;
    @GetMapping("/projects/{pageNumber}/{pageSize}")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getProjects(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                         @PathVariable @Min(0) Integer pageNumber,
                                         @PathVariable @Min(1) Integer pageSize) {

        PagedGlobalDTO requestDTO = new PagedGlobalDTO(userPrincipal.userId(), pageNumber, pageSize);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(
                        projectService.getProjects(GlobalDTO.fromUserId(userPrincipal.userId()), requestDTO),
                        HttpStatus.OK
                ));
    }

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
                        projectService.getLargestTeamProject(GlobalDTO.fromUserId(userPrincipal.userId())),
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

    @PutMapping("/reports/update")
    @PreAuthorize("hasAuthority('RC:WRITE')")
    public ResponseEntity<?> updateReportStatus(@RequestBody RCUpdateReportDTO rcUpdateReportDTO) {
        System.out.println(rcUpdateReportDTO.reportId());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.updateReportStatus(rcUpdateReportDTO), HttpStatus.OK));
    }
    @GetMapping("/reports")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRCReports(@ModelAttribute PagedGlobalDTO globalDTO) {


        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.getRCReports(globalDTO), HttpStatus.OK));
    }
    @GetMapping("/reports/byStatus")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRCReportsByStatus(@ModelAttribute RCReportByStatusDTO rcReportByStatusDTO) {


        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.getRCReportsByStatus(rcReportByStatusDTO), HttpStatus.OK));
    }
    @GetMapping("/reports/byDateRange")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRCReportsByDateRange(@ModelAttribute RCReportByDateRangeDTO rcReportByDateRangeDTO) {

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.getRCReportsByDateRange(rcReportByDateRangeDTO), HttpStatus.OK));
    }
    @GetMapping("/reports/byName")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRCReportsByName(@ModelAttribute RCReportByUserDTO rcReportByUserDTO) {

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.getRCReportsByUser(rcReportByUserDTO), HttpStatus.OK));
    }
    @GetMapping("/rotations/client/{clientId}/{pageNumber}/{pageSize}")
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

    @GetMapping("/rotations")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersActiveRotation(
           @ModelAttribute PagedGlobalDTO globalDTO
            ) {

        PagedRotationsDTO response = assignedRotationService.getUsersActiveRotations(globalDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(response, HttpStatus.OK));
    }
    @GetMapping("/projects/byLabel")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcProjectsByLabel(
            @RequestParam
            @Size(max = 20, message = "Label must not exceed 20 characters")
         String label
    ) {
        System.out.println(label);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(projectService.getRcProjectsByLabel(label), HttpStatus.OK));
    }
    @GetMapping("/clients/byLabel")
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
    @GetMapping("/factories")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcFactories(
            ) {

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(factoryService.getRcFactories(), HttpStatus.OK));
    }
    @GetMapping("/subFactories")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRcSubFactories(

    ) {

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(subFactoryService.getRcSubFactories(), HttpStatus.OK));
    }
    @GetMapping("/users/byName")
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
    @PostMapping("/rotations/createRotation")
    @PreAuthorize("hasAuthority('RC:WRITE')")
    public ResponseEntity<?> createAssignedRotation(
            @RequestBody CreateAssignedRotationDTO createAssignedRotationDTO
            ) {
        System.out.println(createAssignedRotationDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(assignedRotationService.createAssignedRotation(createAssignedRotationDTO), HttpStatus.OK));
    }

    @PutMapping("/rotations/updateRotation")
    @PreAuthorize("hasAuthority('RC:WRITE')")
    public ResponseEntity<?> updateRotationByDate(
            @RequestBody UpdateRotationDTO updateRotationDTO
    ) {
        System.out.println(updateRotationDTO);
        assignedRotationService.updateRotationByDate(updateRotationDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success("Rotation updated successfully", HttpStatus.OK));
    }

    @GetMapping("/rotations/byName")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersActiveRotationByName(
            @ModelAttribute  UsersRotationsByNameDTO usersRotationsByNameDTO
            ) {
        System.out.println(usersRotationsByNameDTO);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(assignedRotationService.getUsersActiveRotationsByName(usersRotationsByNameDTO), HttpStatus.OK));
    }
    @GetMapping("/rotations/byProject")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersActiveRotationByProject(
  @ModelAttribute UsersRotationsByProjectDTO usersRotationsByProjectDTO
            ) {

        PagedRotationsDTO response = assignedRotationService.getUsersActiveRotationsByProject(usersRotationsByProjectDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(response, HttpStatus.OK));
    }
    @GetMapping("/rotations/byClient")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersActiveRotationByClient(

            @ModelAttribute UsersRotationsByClientDTO usersRotationsByClientDTO
    ) {
        PagedRotationsDTO response = assignedRotationService.getUsersActiveRotationsByClient(usersRotationsByClientDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(response, HttpStatus.OK));
    }
    @GetMapping("/rotations/byFactory")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersActiveRotationByFactory(

            @ModelAttribute UsersRotationsByFactoryDTO usersRotationsByFactoryDTO
    ) {
        PagedRotationsDTO response = assignedRotationService.getUsersActiveRotationsByFactory(usersRotationsByFactoryDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(response, HttpStatus.OK));
    }
    @GetMapping("/rotations/bySubFactory")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getUsersActiveRotationBySubFactory(

            @ModelAttribute UsersRotationsBySubFactoryDTO usersRotationsBySubFactoryDTO
    ) {
        PagedRotationsDTO response = assignedRotationService.getUsersActiveRotationsBySubFactory(usersRotationsBySubFactoryDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(response, HttpStatus.OK));
    }
    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getRCDashboardData(


    ) {
        RCDashBoardDTO rcDashBoardDTO=new RCDashBoardDTO((long) projectService.countActiveProjects().projectsCount(),
                (long) projectService.getCompletedProjectsCount().projectsCount(),
                factoryService.getTotalFactoriesCount(),
                subFactoryService.getTotalCapacity(),
                assignedRotationService.currentWeekOnSiteAssociatesCount(),
                projectService.getLongestDurationProject(),
                projectService.getRCLargestMembersProject(),
                reportService.getRCPendingReports(new PagedGlobalDTO(null,0,10)).reports());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(rcDashBoardDTO, HttpStatus.OK));
    }

}
