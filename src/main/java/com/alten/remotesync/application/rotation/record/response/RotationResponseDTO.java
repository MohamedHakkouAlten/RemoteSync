package com.alten.remotesync.application.rotation.record.response;

import java.util.Date;
import java.util.UUID;

public record RotationResponseDTO(
        UUID rotationId,
        String rotationName,
        Date startDate,
        Date endDate,
        UUID projectId
) {}
