package com.alten.remotesync.application.report.record.response;

import java.util.List;

public record RCPagedReportDTO(
        List<ReportProjectionDTO> reports,
        Integer totalPages,
        Long totalElements,
        Integer currentPage,
        Integer pageSize
) {
}
