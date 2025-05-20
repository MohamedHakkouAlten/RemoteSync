package com.alten.remotesync.application.report.record.request;

import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;


public record RCReportByDateRangeDTO(
        @NotNull(message = "Start date cannot be null")
        LocalDate startDate,

        @NotNull(message = "End date cannot be null")
        LocalDate endDate,

        @NotNull(message = "Page number cannot be null")
        Integer pageNumber,

        @Min(value = 1, message = "Page size must be at least 1")
        @Max(value = 100, message = "Page size cannot exceed 100")
        Integer pageSize
) {
}
