package com.alten.remotesync.application.assignedRotation.record.request;

import com.alten.remotesync.domain.customDate.model.CustomDate;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record RcUpdateAssociateRotationDTO(
        @NotNull(message = "userId is required")
        UUID userId,

        List<CustomDate> customDates
) {
}
