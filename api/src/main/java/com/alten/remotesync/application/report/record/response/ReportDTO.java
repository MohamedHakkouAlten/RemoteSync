package com.alten.remotesync.application.report.record.response;

import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import com.alten.remotesync.domain.report.enumeration.ReportType;
import com.alten.remotesync.domain.user.model.User;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReportDTO(
        UUID reportId,

        String title,

        String reason,

        ReportType type,

        ReportStatus status,

        String description,

        LocalDateTime createdAt,

        LocalDateTime updatedAt,

        User createdBy,

        User updatedBy



) {
}