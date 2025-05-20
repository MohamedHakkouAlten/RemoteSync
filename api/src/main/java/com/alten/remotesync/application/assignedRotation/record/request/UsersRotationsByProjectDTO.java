package com.alten.remotesync.application.assignedRotation.record.request;

import jakarta.validation.constraints.*;

public record UsersRotationsByProjectDTO(
        @NotEmpty(message = "project cannot be empty")
        String projectId,

        @Min(value = 0,message = "Page number must be at least 1")
        @NotNull(message = "Page number cannot be null")
        Integer pageNumber,

        @Min(value = 1, message = "Page size must be at least 1")
        @Max(value = 100, message = "Page size cannot exceed 100")
        Integer pageSize

) {
}

