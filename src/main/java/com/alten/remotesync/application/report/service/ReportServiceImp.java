package com.alten.remotesync.application.report.service;

import com.alten.remotesync.adapter.exception.report.ReportNotFoundException;
import com.alten.remotesync.application.report.mapper.ReportMapper;
import com.alten.remotesync.application.report.record.request.AssociateReportDTO;
import com.alten.remotesync.application.report.record.request.CreateAssociateReportDTO;
import com.alten.remotesync.application.report.record.response.PagedReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import com.alten.remotesync.domain.report.model.Report;
import com.alten.remotesync.domain.report.repository.ReportDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReportServiceImp implements ReportService {
    private final ReportDomainRepository reportDomainRepository;
    private final ReportMapper reportMapper;

    @Override
    public ReportDTO createAssociateReport(CreateAssociateReportDTO createAssociateReportDTO) {
        Report report=reportMapper.toAssociateReport(createAssociateReportDTO);
        report.setStatus(ReportStatus.OPENED);
        return reportMapper.toReportDTO(reportDomainRepository.save(report)) ;
    }

    @Override
    public PagedReportDTO getAssociateReports(AssociateReportDTO associateReportDTO) {
        Page<Report> pagedReports = reportDomainRepository.findAllByCreatedBy_UserIdAndStatus(
                associateReportDTO.userId(),
                associateReportDTO.status(),
                PageRequest.of(associateReportDTO.pageNumber(), (associateReportDTO.pageSize() != null) ? associateReportDTO.pageSize() : 10, Sort.by(Sort.Direction.DESC, "createdAt")))
                .orElseThrow(() -> new ReportNotFoundException("Report Not Found"));

        return new PagedReportDTO(pagedReports.getContent().stream().map(reportMapper::toReportDTO).toList(),
                pagedReports.getTotalPages(),
                pagedReports.getTotalElements(),
                associateReportDTO.pageNumber() + 1,
                associateReportDTO.pageSize()
        );
    }
}
