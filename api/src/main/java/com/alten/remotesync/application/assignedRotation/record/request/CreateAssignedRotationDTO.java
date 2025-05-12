package com.alten.remotesync.application.assignedRotation.record.request;


import com.alten.remotesync.domain.customDate.model.CustomDate;
import com.alten.remotesync.domain.rotation.enumeration.RotationStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record CreateAssignedRotationDTO(
        @NotEmpty(message = "Associates list must not be empty")
        List<String> associates,


        List<CustomDate> customDates,


        String projectId,

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
