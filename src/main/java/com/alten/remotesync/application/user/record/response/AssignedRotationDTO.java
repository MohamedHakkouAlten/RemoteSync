package com.alten.remotesync.application.user.record.response;

import java.util.UUID;

public record AssignedRotationDTO(
        UUID rotationId,
        String rotationName,
        String rotationAssignmentStatus
) {}
