package com.alten.remotesync.application.report.record.request;

import com.alten.remotesync.domain.report.enumeration.ReportType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateAssociateReportDTO(
        @NotBlank(message = "Title cannot be blank")
        @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
        String title,

        @NotBlank(message = "Reason cannot be blank")
        @Size(min = 1, max = 500, message = "Reason must be between 1 and 500 characters")
        String reason,

        @NotBlank(message = "Description cannot be blank")
        String description,

        @NotNull(message = "Report type cannot be null")
        ReportType type
) {
}
