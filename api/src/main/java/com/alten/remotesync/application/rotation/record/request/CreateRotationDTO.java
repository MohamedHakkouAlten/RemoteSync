package com.alten.remotesync.application.rotation.record.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import java.util.UUID;


public record CreateRotationDTO(
        @NotEmpty(message = "User IDs list must not be empty")
        List<UUID> userIds,

        @NotEmpty(message = "Dates list must not be empty")
        List<Date> dates,

        @NotNull(message = "Project ID must not be null")
        UUID projectId,

        @NotBlank(message = "Rotation name must not be blank")
        String rotationName
) {}
