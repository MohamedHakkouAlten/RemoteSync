package com.alten.remotesync.application.globalDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PagedGlobalDTO(

        UUID uuid,

        @NotNull
        @Min(value = 0, message = "Page size must be at least 1")
        Integer pageNumber,
        @NotNull
        @Min(value = 0, message = "Page size must be at least 1")
        Integer pageSize
) {
}
