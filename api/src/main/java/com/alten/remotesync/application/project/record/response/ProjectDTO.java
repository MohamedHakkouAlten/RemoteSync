package com.alten.remotesync.application.project.record.response;

import com.alten.remotesync.domain.client.model.Client;
import com.alten.remotesync.domain.project.enumeration.ProjectStatus;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

public record ProjectDTO(


        UUID projectId,

        String label,

        String titre,

        ProjectStatus status,

        LocalDate deadLine,
        LocalDate startDate,

        boolean isDeleted,

        Client owner
) {
}
    

