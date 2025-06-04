package com.alten.remotesync.application.project.record.request;


import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateProjectDTO(
        @NotNull(message = "Project ID must not be null")
        UUID projectId,

        @NotNull(message = "Label must not be null")
        String label,

        @NotNull(message = "Title must not be null")
        String titre,

        @NotNull(message = "isDeleted must not be null")
        Boolean isDeleted,

        @NotNull(message = "Project status must not be null")
        ProjectStatus status,

        @NotNull(message = "Deadline must not be null")
        LocalDate deadLine,

        @NotNull(message = "Start date must not be null")
        LocalDate startDate,

        @NotNull
        UUID clientId

) {
}
