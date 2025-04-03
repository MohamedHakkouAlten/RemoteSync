package com.alten.remotesync.application.report.mapper;

import com.alten.remotesync.application.report.record.request.CreateAssociateReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import com.alten.remotesync.domain.report.enumeration.ReportType;
import com.alten.remotesync.domain.report.model.Report;
import com.alten.remotesync.domain.user.model.User;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-02T13:57:25+0000",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.14 (Azul Systems, Inc.)"
)
@Component
public class ReportMapperImpl implements ReportMapper {

    @Override
    public ReportDTO toReportDTO(Report report) {
        if ( report == null ) {
            return null;
        }

        UUID reportId = null;
        String title = null;
        String reason = null;
        ReportType type = null;
        ReportStatus status = null;
        String description = null;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;
        User createdBy = null;
        User updatedBy = null;

        reportId = report.getReportId();
        title = report.getTitle();
        reason = report.getReason();
        type = report.getType();
        status = report.getStatus();
        description = report.getDescription();
        createdAt = report.getCreatedAt();
        updatedAt = report.getUpdatedAt();
        createdBy = report.getCreatedBy();
        updatedBy = report.getUpdatedBy();

        ReportDTO reportDTO = new ReportDTO( reportId, title, reason, type, status, description, createdAt, updatedAt, createdBy, updatedBy );

        return reportDTO;
    }

    @Override
    public Report toAssociateReport(CreateAssociateReportDTO createAssociateReportDTO) {
        if ( createAssociateReportDTO == null ) {
            return null;
        }

        Report.ReportBuilder report = Report.builder();

        report.title( createAssociateReportDTO.title() );
        report.reason( createAssociateReportDTO.reason() );
        report.type( createAssociateReportDTO.type() );

        return report.build();
    }
}
