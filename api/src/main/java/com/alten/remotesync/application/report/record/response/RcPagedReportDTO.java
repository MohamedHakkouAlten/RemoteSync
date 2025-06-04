package com.alten.remotesync.application.report.record.response;

import java.util.List;

public record RcPagedReportDTO(
        List<ReportDTO> reports,
        Integer totalPages,
        Long totalElements,
        Integer currentPage,
        Integer pageSize
) {
}
