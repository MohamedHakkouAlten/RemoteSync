package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.user.record.response.UserProfileDTO;
import com.alten.remotesync.application.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    private final ReportService reportService;

    @GetMapping("/associate/{userId}")
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")

    public ResponseEntity<?> getAssociateProfile(@PathVariable UUID userId) {
        UserProfileDTO profile = userService.getMyProfile(GlobalDTO.fromUserId(userId));
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(profile, HttpStatus.OK));
    }

    @GetMapping({"/associate/projects/current"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> associateCurrentProject(@AuthenticationPrincipal UserPrincipal userPrincipal) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(projectService.getAssociateCurrentProject(
                                GlobalDTO.fromUserId(userPrincipal.userId())),
                        HttpStatus.OK));
    }

    @GetMapping({"/associate/projects/old"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> associateOldProjects(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @ModelAttribute PagedGlobalIdDTO pagedGlobalIdDTO) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(projectService.getAssociateOldProjects(
                                GlobalDTO.fromUserId(userPrincipal.userId()),
                                pagedGlobalIdDTO),
                        HttpStatus.OK));
    }

    @GetMapping({"/associate/projects/{projectId}"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> associateProjectDetails(@PathVariable("projectId") String projectId) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(projectService.getProjectDetails(
                                GlobalDTO.fromProjectId(UUID.fromString(projectId))),
                        HttpStatus.OK));
    }

    @GetMapping({"/associate/projects/byLabel"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> associateSearchProject(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @ModelAttribute AssociateProjectByLabelDTO associateProjectByLabelDTO) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(projectService.getAssociateOldProjectsByLabel(
                                GlobalDTO.fromUserId(userPrincipal.userId()),
                                associateProjectByLabelDTO),
                        HttpStatus.OK));

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



