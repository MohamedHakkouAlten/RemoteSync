package com.alten.remotesync.application.project.record.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssociateProjectByLabelDTO(
        @NotNull
        String label,
        @NotNull
        UUID userId,
        @NotNull
        Integer pageNumber,
        Integer pageSize
) {
        public AssociateProjectByLabelDTO(String label, UUID userId, Integer pageNumber) {
                this(label, userId, pageNumber, 0);

        }
}
