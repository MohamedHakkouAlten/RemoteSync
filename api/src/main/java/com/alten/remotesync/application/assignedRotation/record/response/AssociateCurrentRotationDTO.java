package com.alten.remotesync.application.assignedRotation.record.response;

import lombok.Builder;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Builder
public record AssociateCurrentRotationDTO(
        UUID projectId,
        String projectLabel,
        List<LocalDate> onSiteDates,
        List<LocalDate> remoteDates
) {
}
