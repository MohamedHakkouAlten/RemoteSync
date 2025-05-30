package com.alten.remotesync.application.report.record.request;

import com.alten.remotesync.domain.report.enumeration.ReportStatus;

import java.time.LocalDate;

public record PagedReportSearchDTO(
        Integer pageNumber,
        Integer pageSize,
        String title,
        ReportStatus status,
        LocalDate startDate
) {
}
