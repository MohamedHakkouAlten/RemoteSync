package com.alten.remotesync.application.globalDTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PagedGlobalIdDTO(

        @NotNull
        @Min(value = 0, message = "Page size must be at least 1")
        Integer pageNumber,

        Integer pageSize
) {
}
