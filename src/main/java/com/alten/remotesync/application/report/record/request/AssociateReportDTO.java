package com.alten.remotesync.application.report.record.request;

import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssociateReportDTO(
        UUID userId,
        @NotNull
        ReportStatus status,
        @NotNull
        Integer pageNumber,
        Integer pageSize
) {
}
