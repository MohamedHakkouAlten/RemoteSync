package com.alten.remotesync.application.report.record.request;

import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RcUpdateReportDTO(
        @NotNull(message = "reportId must be provided")
        UUID reportId,

        @NotNull(message = "Status can't be null")
        ReportStatus status
) {
}
