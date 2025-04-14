package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalIdDTO;
import com.alten.remotesync.application.project.service.ProjectService;
import com.alten.remotesync.application.assignedRotation.service.AssignedRotationService;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rc")
@RequiredArgsConstructor
public class RcController {

    private final ProjectService projectService;
    private final AssignedRotationService assignedRotationService;


    @GetMapping("/projects/{pageNumber}/{pageSize}")
    @PreAuthorize("hasAuthority('RC:READ')")
    public ResponseEntity<?> getProjects(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                         @PathVariable @Min(0) Integer pageNumber,
                                         @PathVariable @Min(1) Integer pageSize) {

        PagedGlobalIdDTO requestDTO = new PagedGlobalIdDTO(userPrincipal.userId(), pageNumber, pageSize);
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
                        projectService.countActiveProjects(GlobalDTO.fromUserId(userPrincipal.userId())),
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
                        projectService.countCancelledProjects(GlobalDTO.fromUserId(userPrincipal.userId())),
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

}
