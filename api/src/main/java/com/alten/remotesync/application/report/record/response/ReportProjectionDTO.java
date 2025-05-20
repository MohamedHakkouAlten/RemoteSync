package com.alten.remotesync.application.report.record.response;

import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import com.alten.remotesync.domain.report.projection.ReportUserProjection;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReportProjectionDTO(
        UUID reportId,

        String title,

        String description,

        ReportStatus status,

        ReportUserProjection createdBy,

        LocalDateTime createdAt


) {
}
