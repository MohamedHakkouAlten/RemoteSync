package com.alten.remotesync.application.report.record.request;


import com.alten.remotesync.domain.report.enumeration.ReportType;
import jakarta.validation.constraints.NotNull;

public record AssociateReportDTO(

        @NotNull
        String title,

        @NotNull
        String reason,

        @NotNull
        ReportType type


) {
}
