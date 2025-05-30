package com.alten.remotesync.application.report.mapper;

import com.alten.remotesync.application.report.record.request.CreateAssociateReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.application.report.record.response.ReportProjectionDTO;
import com.alten.remotesync.domain.report.model.Report;
import com.alten.remotesync.domain.report.projection.ReportProjection;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReportMapper {
    ReportDTO toReportDTO(Report report);
    //ReportProjectionDTO toReportProjectionDTO(ReportProjection reportProjection);

    Report toAssociateReport(CreateAssociateReportDTO createAssociateReportDTO);
}
