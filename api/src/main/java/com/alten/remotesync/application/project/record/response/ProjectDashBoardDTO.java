package com.alten.remotesync.application.project.record.response;

import com.alten.remotesync.domain.project.enumeration.ProjectStatus;

import java.time.LocalDate;
import java.util.UUID;

public record ProjectDashBoardDTO(

        UUID projectId,

        String label,
        String titre,

        ProjectStatus status,

        LocalDate deadLine,
        LocalDate startDate
) {
}
