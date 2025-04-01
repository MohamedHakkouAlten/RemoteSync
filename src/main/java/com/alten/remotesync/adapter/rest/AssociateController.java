package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.user.record.request.LoginRequestDTO;
import com.alten.remotesync.application.user.record.request.UpdateUserProfileDTO;
import com.alten.remotesync.application.user.record.response.LoginResponseDTO;
import com.alten.remotesync.application.user.record.response.UserProfileDTO;
import com.alten.remotesync.application.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class AssociateController {
    private final UserService userService;

    @GetMapping("/associate/{userId}")
    public ResponseEntity<UserProfileDTO> getAssociateProfile(@PathVariable UUID userId) {
        UserProfileDTO profile = userService.getMyProfile(GlobalDTO.fromUserId(userId));
        return ResponseEntity.ok(profile);
    }

}