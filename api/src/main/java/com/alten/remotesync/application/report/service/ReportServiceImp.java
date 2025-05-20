package com.alten.remotesync.application.report.service;

import com.alten.remotesync.adapter.exception.report.ReportNotFoundException;
import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
import com.alten.remotesync.application.report.mapper.ReportMapper;
import com.alten.remotesync.application.report.record.request.*;
import com.alten.remotesync.application.report.record.response.PagedReportDTO;
import com.alten.remotesync.application.report.record.response.RCPagedReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.application.report.record.response.ReportProjectionDTO;
import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import com.alten.remotesync.domain.report.model.Report;
import com.alten.remotesync.domain.report.projection.ReportProjection;
import com.alten.remotesync.domain.report.repository.ReportDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ReportServiceImp implements ReportService {
    private final ReportDomainRepository reportDomainRepository;
    private final ReportMapper reportMapper;

    @Override
    public ReportDTO createAssociateReport(CreateAssociateReportDTO createAssociateReportDTO) {
        Report report=reportMapper.toAssociateReport(createAssociateReportDTO);
        report.setStatus(ReportStatus.OPENED);
        // SHOULD SET AUTOMATICALLY THE USER NOT MANUALLY @CreatedBy @LastModifiedBy ...etc
        return reportMapper.toReportDTO(reportDomainRepository.save(report)) ;
    }

    @Override
    public PagedReportDTO getAssociateReports(AssociateReportDTO associateReportDTO) {
        Page<Report> pagedReports = reportDomainRepository.findAllByCreatedBy_UserId(
                associateReportDTO.userId(),
                PageRequest.of(associateReportDTO.pageNumber(), (associateReportDTO.pageSize() != null) ? associateReportDTO.pageSize() : 10, Sort.by(Sort.Direction.DESC, "createdAt")))
                .orElseThrow(() -> new ReportNotFoundException("Report Not Found"));

        return new PagedReportDTO(pagedReports.getContent().stream().map(reportMapper::toReportDTO).toList(),
                pagedReports.getTotalPages(),
                pagedReports.getTotalElements(),
                associateReportDTO.pageNumber() + 1,
                associateReportDTO.pageSize()
        );
    }
    @Override
    public String updateReportStatus(RCUpdateReportDTO rcUpdateReportDTO) {

        Report report = reportDomainRepository.findById(rcUpdateReportDTO.reportId())
                .orElseThrow(() -> new ReportNotFoundException("Report with ID " + rcUpdateReportDTO.reportId() + " not found"));
        report.setStatus(rcUpdateReportDTO.status());
        reportDomainRepository.save(report);
        return "successful report update";
    }

    @Override
    public RCPagedReportDTO getRCPendingReports(PagedGlobalDTO pagedGlobalDTO) {
        Page<ReportProjection> pagedReports= reportDomainRepository.findAllByStatus(PageRequest.of(0,6),ReportStatus.PENDING).orElseThrow(()->new ReportNotFoundException("no reports were found"));

        return new RCPagedReportDTO( pagedReports.getContent().stream().map(reportMapper::toReportProjectionDTO).toList(), pagedReports.getTotalPages(),
                pagedReports.getTotalElements(), pagedGlobalDTO.pageNumber(), pagedGlobalDTO.pageSize()
                );
    }

    @Override
    public RCPagedReportDTO getRCReports(PagedGlobalDTO pagedGlobalDTO) {
        Page<ReportProjection> pagedReports = reportDomainRepository.findAllBy(
                        PageRequest.of(pagedGlobalDTO.pageNumber(), (pagedGlobalDTO.pageSize() != null) ? pagedGlobalDTO.pageSize() : 10))
                .orElseThrow(() -> new ReportNotFoundException("Report Not Found"));


        return new RCPagedReportDTO(pagedReports.getContent().stream().map(reportMapper::toReportProjectionDTO).toList(),
                pagedReports.getTotalPages(),
                pagedReports.getTotalElements(),
                pagedGlobalDTO.pageNumber() + 1,
                pagedGlobalDTO.pageSize()
        );
    }

    @Override
    public RCPagedReportDTO getRCReportsByStatus(RCReportByStatusDTO rcReportByStatusDTO) {
        Page<ReportProjection> pagedReports = reportDomainRepository.findAllByStatus(
                        PageRequest.of(rcReportByStatusDTO.pageNumber(), (rcReportByStatusDTO.pageSize() != null) ? rcReportByStatusDTO.pageSize() : 10),
                        rcReportByStatusDTO.status()
                        )
                .orElseThrow(() -> new ReportNotFoundException("Report Not Found"));


        return new RCPagedReportDTO(pagedReports.getContent().stream().map(reportMapper::toReportProjectionDTO).toList(),
                pagedReports.getTotalPages(),
                pagedReports.getTotalElements(),
                rcReportByStatusDTO.pageNumber() + 1,
                rcReportByStatusDTO.pageSize()
        );
    }

    @Override
    public RCPagedReportDTO getRCReportsByDateRange(RCReportByDateRangeDTO rcReportByDateRangeDTO) {
        Page<ReportProjection> pagedReports = reportDomainRepository.findAllByCreatedAtBetween(
                        PageRequest.of(rcReportByDateRangeDTO.pageNumber(), (rcReportByDateRangeDTO.pageSize() != null) ? rcReportByDateRangeDTO.pageSize() : 10),
                        LocalDateTime.of(rcReportByDateRangeDTO.startDate(), LocalTime.MIDNIGHT) , LocalDateTime.of(rcReportByDateRangeDTO.endDate(), LocalTime.MIDNIGHT)
                )
                .orElseThrow(() -> new ReportNotFoundException("Report Not Found"));


        return new RCPagedReportDTO(pagedReports.getContent().stream().map(reportMapper::toReportProjectionDTO).toList(),
                pagedReports.getTotalPages(),
                pagedReports.getTotalElements(),
                rcReportByDateRangeDTO.pageNumber() + 1,
                rcReportByDateRangeDTO.pageSize()
        );
    }

    @Override
    public RCPagedReportDTO getRCReportsByUser(RCReportByUserDTO rcReportByUserDTO) {
        Page<ReportProjection> pagedReports = reportDomainRepository.findAllByName(
                        PageRequest.of(rcReportByUserDTO.pageNumber(), (rcReportByUserDTO.pageSize() != null) ? rcReportByUserDTO.pageSize() : 10),
                        rcReportByUserDTO.name()
                )
                .orElseThrow(() -> new ReportNotFoundException("Report Not Found"));


        return new RCPagedReportDTO(pagedReports.getContent().stream().map(reportMapper::toReportProjectionDTO).toList(),
                pagedReports.getTotalPages(),
                pagedReports.getTotalElements(),
                rcReportByUserDTO.pageNumber() + 1,
                rcReportByUserDTO.pageSize()
        );

    }
}
