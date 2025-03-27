package com.alten.remotesync.application.project.record.request;

import jakarta.validation.constraints.NotNull;

public record ProjectLabelDTO(
        @NotNull
        String label
) {
}
