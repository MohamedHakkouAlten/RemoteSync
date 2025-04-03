package com.alten.remotesync.application.report.record.response;

import java.util.List;

public record PagedReportDTO(
        List<ReportDTO> reportDTOs,
        Integer totalPages,
        Long totalElements,
        Integer currentPage,
        Integer pageSize
) {
}
