package com.alten.remotesync.application.project.record.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssociateProjectByClientDTO(
    @NotNull(message = "Client cannot be null")
    UUID clientId,

    @Min(value = 0,message = "Page number must be at least 1")
    @NotNull(message = "Page number cannot be null")
    Integer pageNumber,

    @Min(value = 0, message = "Page size must be at least 1")
    @Max(value = 100, message = "Page size cannot exceed 100")
    Integer pageSize
) {

}
