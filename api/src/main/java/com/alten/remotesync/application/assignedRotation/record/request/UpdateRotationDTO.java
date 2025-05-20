package com.alten.remotesync.application.assignedRotation.record.request;

import com.alten.remotesync.domain.customDate.model.CustomDate;
import com.alten.remotesync.domain.rotation.enumeration.RotationStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record UpdateRotationDTO(
       @NotNull(message = "userId is required")
        String userId,

        List<CustomDate> customDates,

        String projectId,

        @NotEmpty(message = "updated date must not be null")
        String updatedDate,
        @NotEmpty(message = "updated date must not be null")
       RotationStatus updatedStatus,

        @NotEmpty(message = "Start date must not be null")
        String startDate,

        @NotEmpty(message = "End date must not be null")
        String endDate,

        @NotNull(message = "Shift must not be null")
        Integer shift,

        @NotNull(message = "Cycle must not be null")
        Integer cycle


) {
}
