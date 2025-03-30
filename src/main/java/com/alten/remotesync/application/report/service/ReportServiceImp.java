package com.alten.remotesync.application.report.service;

import com.alten.remotesync.application.report.mapper.ReportMapper;
import com.alten.remotesync.application.report.record.request.AssociateReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import com.alten.remotesync.domain.report.model.Report;
import com.alten.remotesync.domain.report.repository.ReportDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReportServiceImp implements ReportService {
    private final ReportDomainRepository reportDomainRepository;
    private final ReportMapper reportMapper;

    @Override
    public ReportDTO createAssociateReport(AssociateReportDTO associateReportDTO) {
        Report report=reportMapper.toAssociateReport(associateReportDTO);
        report.setStatus(ReportStatus.OPENED);
        return reportMapper.toReportDTO(reportDomainRepository.save(report)) ;
    }
}
