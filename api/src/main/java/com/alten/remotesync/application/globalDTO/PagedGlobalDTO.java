package com.alten.remotesync.application.globalDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PagedGlobalDTO(

        java.util.UUID uuid, @NotNull
        @Min(value = 0, message = "Page size must be at least 1")
        Integer pageNumber,

        Integer pageSize
) {
}
