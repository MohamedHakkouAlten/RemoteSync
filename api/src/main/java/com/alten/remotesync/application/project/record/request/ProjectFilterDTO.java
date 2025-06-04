package com.alten.remotesync.application.project.record.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ProjectFilterDTO(

        String filter,

        String sort,

        Integer sortType,

        String value,

        @NotNull
        @Min(value = 0, message = "Page size must be at least 1")
        Integer pageNumber,
        @NotNull
        @Min(value = 0, message = "Page size must be at least 1")
        Integer pageSize
) {
}
