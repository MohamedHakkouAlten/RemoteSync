package com.alten.remotesync.application.report.mapper;

import com.alten.remotesync.application.report.record.request.CreateAssociateReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.domain.report.model.Report;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReportMapper {
    ReportDTO toReportDTO(Report report);
    Report toAssociateReport(CreateAssociateReportDTO createAssociateReportDTO);
}
