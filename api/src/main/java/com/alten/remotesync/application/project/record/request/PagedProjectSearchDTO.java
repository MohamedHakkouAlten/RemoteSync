package com.alten.remotesync.application.project.record.request;

import com.alten.remotesync.domain.project.enumeration.ProjectStatus;

import java.util.UUID;

public record PagedProjectSearchDTO(
        Integer pageNumber,
        Integer pageSize,
        UUID clientId,
        String label,
        ProjectStatus status
) {}