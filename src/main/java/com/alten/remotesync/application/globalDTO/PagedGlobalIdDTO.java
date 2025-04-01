package com.alten.remotesync.application.globalDTO;

import jakarta.validation.constraints.NotNull;

public record PagedGlobalIdDTO(
        GlobalDTO globalDTO,
        @NotNull
        Integer pageNumber,
        Integer pageSize
) {
}
