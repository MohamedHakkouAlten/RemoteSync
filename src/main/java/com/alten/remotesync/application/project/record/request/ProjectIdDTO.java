package com.alten.remotesync.application.project.record.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ProjectIdDTO(
        @NotNull
        UUID projectId
) {
}
