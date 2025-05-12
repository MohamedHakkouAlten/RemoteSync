package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import com.alten.remotesync.application.assignedRotation.record.request.CreateAssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.response.PagedAssignedRotationDTO;
import com.alten.remotesync.application.assignedRotation.record.response.PagedRotationsDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
import com.alten.remotesync.application.project.service.ProjectService;
import com.alten.remotesync.application.assignedRotation.service.AssignedRotationService;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.application.report.service.ReportService;
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

import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user/rc")
@RequiredArgsConstructor
public class RcController {

    private final ProjectService projectService;
    private final AssignedRotationService assignedRotationService;
    private final ReportService reportService;
    private final UserService userService;

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
    @PutMapping("/rotations/update/{userId}")
    @PreAuthorize("hasAuthority('RC:WRITE')")
    public ResponseEntity<?> updateRotationByDate(
            @PathVariable UUID userId,
            @RequestParam Date date) {
        assignedRotationService.updateRotationByDate(userId, date);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success("Rotation updated successfully", HttpStatus.OK));
    }
    @PutMapping("/reports/{reportId}/status")
    @PreAuthorize("hasAuthority('RC:WRITE')")
    public ResponseEntity<?> updateReportStatus(@PathVariable UUID reportId,
                                                @RequestParam ReportStatus status) {
        ReportDTO updatedReport = reportService.updateReportStatus(reportId, status);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(updatedReport, HttpStatus.OK));
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
            @AuthenticationPrincipal UserPrincipal userPrincipal,
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
    @PostMapping("/createRotation")
    @PreAuthorize("hasAuthority('RC:WRITE')")
    public ResponseEntity<?> createAssignedRotation(
            @RequestBody CreateAssignedRotationDTO createAssignedRotationDTO
            ) {
        System.out.println(createAssignedRotationDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(assignedRotationService.createAssignedRotation(createAssignedRotationDTO), HttpStatus.OK));
    }
}
