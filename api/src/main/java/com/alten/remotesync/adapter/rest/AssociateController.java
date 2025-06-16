package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import com.alten.remotesync.application.assignedRotation.record.response.OnSiteWeeksDTO;
import com.alten.remotesync.application.assignedRotation.service.AssignedRotationService;
import com.alten.remotesync.application.client.record.response.ClientDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.notification.record.request.NotificationByStatusDTO;
import com.alten.remotesync.application.notification.record.request.PagedNotificationSearchDTO;
import com.alten.remotesync.application.notification.record.response.AssociateInitialeNotificationsDTO;
import com.alten.remotesync.application.notification.record.response.AssociatePanelNotificationsDTO;
import com.alten.remotesync.application.notification.service.NotificationService;
import com.alten.remotesync.application.project.record.request.PagedProjectSearchDTO;
import com.alten.remotesync.application.project.record.response.PagedProjectDTO;
import com.alten.remotesync.application.project.record.response.ProjectDTO;
import com.alten.remotesync.application.project.record.response.RcProjectsCountDTO;
import com.alten.remotesync.application.project.service.ProjectService;
import com.alten.remotesync.application.report.record.request.AssociateReportDTO;
import com.alten.remotesync.application.report.record.request.PagedReportSearchDTO;
import com.alten.remotesync.application.report.record.response.PagedReportDTO;
import com.alten.remotesync.application.report.service.ReportService;
import com.alten.remotesync.application.user.record.request.AssociateUpdateProfileDTO;
import com.alten.remotesync.application.user.service.UserService;
import com.alten.remotesync.domain.notification.enumeration.NotificationStatus;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Not;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.alten.remotesync.application.report.record.request.CreateAssociateReportDTO;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class AssociateController {
    private final UserService userService;
    private final ProjectService projectService;
    private final AssignedRotationService assignedRotationService;
    private final ReportService reportService;
    private final NotificationService notificationService;

    @GetMapping("/associate/dashboard")
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> getAssociateDashboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        RcProjectsCountDTO rcProjectsCountDTO = projectService.getAssociateProjectsCount(GlobalDTO.fromUserId(userPrincipal.userId()));
        PagedReportDTO pagedReportDTO = reportService.getAssociateReports(new AssociateReportDTO(userPrincipal.userId(), 0, 3));
        Integer reportsCount = reportService.getAssociateTotalReports(GlobalDTO.fromUserId(userPrincipal.userId()));
        ProjectDTO projectDTO = projectService.getAssociateCurrentProject(GlobalDTO.fromUserId(userPrincipal.userId()));
        PagedProjectDTO pagedOldProjectSearchDTO = projectService.getAssociateOldProjects(GlobalDTO.fromUserId(userPrincipal.userId()), new PagedProjectSearchDTO(0, 3, null, null, null));
        OnSiteWeeksDTO onSiteWeeksDTO = assignedRotationService.getAssociateOnSiteWeeks(GlobalDTO.fromUserId(userPrincipal.userId()));

        Map<String, Object> data = new HashMap<>();
        data.put("projectsCount", rcProjectsCountDTO.projectsCount());
        data.put("recentReports", pagedReportDTO.reportDTOs());
        data.put("reportsCount", reportsCount);
        data.put("currentProject", projectDTO);
        data.put("oldProjects", pagedOldProjectSearchDTO.projectDTOS());
        data.put("onSiteWeeks", onSiteWeeksDTO.onSiteDates());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(data
                                , HttpStatus.OK));
    }

    @GetMapping("/associate/initial-projects")
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> getAssociateInitialProjects(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ClientDTO> clientDTOS = assignedRotationService.getAssociateClients(GlobalDTO.fromUserId(userPrincipal.userId()));
        PagedProjectDTO pagedProjectDTO = projectService.getAssociateOldProjects(GlobalDTO.fromUserId(userPrincipal.userId()), new PagedProjectSearchDTO(0, 10, null, null, null));

        Map<String, Object> data = new HashMap<>();
        data.put("allClients", clientDTOS);
        data.put("projects", pagedProjectDTO);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(data, HttpStatus.OK));
    }

    @GetMapping({"/associate/projects/old"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> associateOldProjects(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @ModelAttribute PagedProjectSearchDTO pagedProjectSearchDTO) {

        return ResponseEntity
                .status(HttpStatus.OK)
                    .body(ResponseWrapper.success(projectService.getAssociateOldProjects(
                                GlobalDTO.fromUserId(userPrincipal.userId()),
                                pagedProjectSearchDTO),
                            HttpStatus.OK));
    }

    // WE NEED ANOTHER ONE THAT WILL ALLOW US TO GET THE OLD ROTATIONS OF AN SELECTED PROJECT WITH STATUS (OVER-RIDDEN)
    @GetMapping("/associate/current-rotations")
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> associateRotations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(assignedRotationService.getAssociateCurrentRotation(
                                GlobalDTO.fromUserId(userPrincipal.userId())),
                                HttpStatus.OK));
    }

    @GetMapping({"/associate/my-reports"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> listMyReports(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @ModelAttribute PagedReportSearchDTO pagedReportSearchDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper
                        .success(reportService.getAssociateOldReports(
                                GlobalDTO.fromUserId(userPrincipal.userId()),
                                        pagedReportSearchDTO)
                                , HttpStatus.OK));
    }

    @PostMapping({"/associate/report/rotation-request"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ')")
    public ResponseEntity<?> associateRotationRequest(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @RequestBody CreateAssociateReportDTO createAssociateReportDTO) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(reportService.createAssociateReport(GlobalDTO.fromUserId(userPrincipal.userId()), createAssociateReportDTO),
                        HttpStatus.OK));
    }

    @GetMapping({"/associate/my-notifications"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ','RC:READ')")
    public ResponseEntity<?> associateNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal, @ModelAttribute PagedNotificationSearchDTO pagedNotificationSearchDTO) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(notificationService.getAssociateNotifications(new PagedNotificationSearchDTO(pagedNotificationSearchDTO.pageNumber(), pagedNotificationSearchDTO.pageSize(), pagedNotificationSearchDTO.title(), pagedNotificationSearchDTO.status(), pagedNotificationSearchDTO.createdAt(), userPrincipal.userId())),
                        HttpStatus.OK));
    }
    @GetMapping({"/associate/notifications/initialize"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ','RC:READ')")
    public ResponseEntity<?> initialAssociateNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal, @ModelAttribute PagedNotificationSearchDTO pagedNotificationSearchDTO) {
        AssociateInitialeNotificationsDTO initialNotificationsDTO=new AssociateInitialeNotificationsDTO(
                notificationService.getAssociateNotifications(new PagedNotificationSearchDTO(0,20, null, null, null, userPrincipal.userId())),
                notificationService.countTotalAssociateNotificationsByStatus(new NotificationByStatusDTO( userPrincipal.userId(),List.of(NotificationStatus.URGENT))),
                notificationService.countTotalAssociateNotificationsByStatus(new NotificationByStatusDTO(userPrincipal.userId(),List.of(NotificationStatus.IMPORTANT))),
                notificationService.countTotalAssociateNotificationsByStatus(new NotificationByStatusDTO(userPrincipal.userId(),List.of(NotificationStatus.NORMAL,NotificationStatus.ALERT,NotificationStatus.INFO)))
        );

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(initialNotificationsDTO,
                        HttpStatus.OK));
    }
    @GetMapping({"/associate/notifications/panel"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ','RC:READ')")
    public ResponseEntity<?> panelAssociateNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal, @ModelAttribute PagedNotificationSearchDTO pagedNotificationSearchDTO) {
        AssociatePanelNotificationsDTO initialNotificationsDTO=new AssociatePanelNotificationsDTO(
                notificationService.getAssociateNotifications(new PagedNotificationSearchDTO(0,20, null, null, null, userPrincipal.userId())),
                notificationService.countUnreadNotifications(userPrincipal.userId())) ;


        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(initialNotificationsDTO,
                        HttpStatus.OK));
    }
    @PutMapping({"/associate/notifications/update"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ','RC:READ')")
    public ResponseEntity<?> setNotificationAsRead(@RequestBody String notificationId) {


       notificationService.setNotificationAsRead(notificationId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success("the notification was set to read successfully",
                        HttpStatus.OK));
    }
    @PutMapping({"/associate/notifications/markAllRead"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ','RC:READ')")
    public ResponseEntity<?> markAllNotificationAsRead(@AuthenticationPrincipal UserPrincipal userPrincipal) {


        notificationService.markAllNotificationAsRead(userPrincipal.userId());
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success("all notification was set to read successfully",
                        HttpStatus.OK));
    }
    @GetMapping({"/associate/my-profile", "/rc/my-profile"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ', 'RC:READ')")
    public ResponseEntity<?> associateProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(userService.getAssociateProfile(GlobalDTO.fromUserId(userPrincipal.userId())),
                        HttpStatus.OK));
    }
    // WE NEED TO ADD PUT FUNCTION TO UPDATE THE USER INFORMATION

    @PutMapping({"/associate/my-profile/update", "/rc/my-profile/update"})
    @PreAuthorize("hasAnyAuthority('ASSOCIATE:READ', 'RC:READ')")
    public ResponseEntity<?> associateUpdateProfile(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @RequestBody AssociateUpdateProfileDTO associateUpdateProfileDTO) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(userService.associateUpdateProfile(GlobalDTO.fromUserId(userPrincipal.userId()), associateUpdateProfileDTO),
                        HttpStatus.OK));
    }
}
