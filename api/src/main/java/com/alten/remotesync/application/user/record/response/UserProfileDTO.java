package com.alten.remotesync.application.user.record.response;

import java.util.List;
import java.util.UUID;

public record UserProfileDTO(
        UUID userId,
        String firstName,
        String lastName,
        String email,
        String username,
        String phoneNumber,
        List<AssignedRotationDTO> assignedRotations
) {}
