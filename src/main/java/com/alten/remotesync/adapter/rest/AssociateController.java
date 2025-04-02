package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import com.alten.remotesync.application.assignedRotation.service.AssignedRotationService;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.project.service.ProjectService;
import com.alten.remotesync.application.report.record.request.AssociateReportDTO;
import com.alten.remotesync.application.report.service.ReportService;
import com.alten.remotesync.application.user.record.request.UpdateUserProfileDTO;
import com.alten.remotesync.application.user.service.UserService;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import jakarta.validation.Valid;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.user.record.response.UserProfileDTO;
import com.alten.remotesync.application.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import com.alten.remotesync.application.globalDTO.PagedGlobalIdDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByClientDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByLabelDTO;
import com.alten.remotesync.application.project.service.ProjectService;
import com.alten.remotesync.application.report.record.request.CreateAssociateReportDTO;
import com.alten.remotesync.application.report.service.ReportService;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;


import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class AssociateController {
    private final UserService userService;
    private final ProjectService projectService;
    private final AssignedRotationService assignedRotationService;
    private final ReportService reportService;

    @GetMapping({"/associate/test", "/admin/test"})
    public String s(){
        return "HAPPY";
    }

    @PutMapping({"/associate/updateMyProfile", "/rc/updateMyProfile", "/admin/updateMyProfile"})
    public ResponseEntity<?> updateMyProfile(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @RequestBody UpdateUserProfileDTO updateUserProfileDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(userService.updateMyProfile(new UpdateUserProfileDTO(userPrincipal.userId(),updateUserProfileDTO))
                                , HttpStatus.OK));
    }

    @GetMapping({"/associate/currentProject", "/rc/currentProject", "/admin/currentProject"})
    public ResponseEntity<?> currentProject(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(projectService.getAssociateCurrentProject(GlobalDTO.fromUserId(userPrincipal.userId()))
                                , HttpStatus.OK));
    }

    @GetMapping({"/associate/currentProjectRotation", "/rc/currentProjectRotation", "/admin/currentProjectRotation"}) // ASSOCIATE ROTATION ROTATION WITH PROJECT
    public ResponseEntity<?> currentProjectRotation(@AuthenticationPrincipal UserPrincipal userPrincipal, GlobalDTO globalDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(assignedRotationService.getAssociateCurrentRotationWithProject(GlobalDTO.fromUserIdAndProjectId(userPrincipal.userId(), globalDTO.projectId()))
                                , HttpStatus.OK));
    }

    @GetMapping({"/associate/oldProjectRotation", "/rc/oldProjectRotation", "/admin/oldProjectRotation"}) // ASSOCIATE OLD ASSIGNED ROTATION WITH PROJECT
    public ResponseEntity<?> oldProjectRotations(@AuthenticationPrincipal UserPrincipal userPrincipal, GlobalDTO globalDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(assignedRotationService.getAssociateOldRotationsWithProject(GlobalDTO.fromUserIdAndProjectId(userPrincipal.userId(), globalDTO.projectId()))
                                , HttpStatus.OK));
    }


    @GetMapping({"/associate/currentRotation", "/rc/currentRotation", "/admin/currentRotation"}) // ASSOCIATE ASSIGNED ROTATION WITHOUT PROJECT
    public ResponseEntity<?> currentRotationWithoutProject(@AuthenticationPrincipal UserPrincipal userPrincipal, GlobalDTO globalDTO) { // NEED REWORK (PAGEABLE IF POSSIBLE IN THE FUTURE)
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(assignedRotationService.getAssociateCurrentRotationWithoutProject(GlobalDTO.fromUserId(userPrincipal.userId()))
                                , HttpStatus.OK));
    }

    @GetMapping({"/associate/oldRotation", "/rc/oldRotation", "/admin/oldRotation"}) // ASSOCIATE OLD ASSIGNED ROTATION WITHOUT PROJECT
    public ResponseEntity<?> oldRotationsWithoutProject(@AuthenticationPrincipal UserPrincipal userPrincipal, GlobalDTO globalDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(assignedRotationService.getAssociateOldRotationsWithoutProject(GlobalDTO.fromUserIdAndProjectId(userPrincipal.userId(), globalDTO.projectId()))
                                , HttpStatus.OK));
    }

    @GetMapping({"/associate/myReports/{pageNumber}/{pageSize}"})
    public ResponseEntity<?> listMyReports(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable Integer pageNumber, @PathVariable Integer pageSize) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(reportService.getAssociateReports(new AssociateReportDTO(userPrincipal.userId(), pageNumber, pageSize))
                                , HttpStatus.OK));
    }
}

    @GetMapping({"/associate/projects/count"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> associateProjectsCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(projectService.getAssociateProjectsCount(
                                GlobalDTO.fromUserId(userPrincipal.userId())),
                        HttpStatus.OK));

    }

    @GetMapping({"/associate/projects/byClient"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> associateProjectsByClient(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @ModelAttribute AssociateProjectByClientDTO associateProjectByClientDTO) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(projectService.getAssociateProjectsByClient(
                                GlobalDTO.fromUserId(userPrincipal.userId()),
                                associateProjectByClientDTO),
                        HttpStatus.OK));

    }

    @PostMapping({"/associate/report/rotation-request"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> associateRotationRequest(@Valid @RequestBody CreateAssociateReportDTO createAssociateReportDTO) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.createAssociateReport(createAssociateReportDTO),
                        HttpStatus.OK));

    }


}



