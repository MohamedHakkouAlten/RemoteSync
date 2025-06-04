package com.alten.remotesync.application.report.service;

import com.alten.remotesync.adapter.exception.report.ReportNotFoundException;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
import com.alten.remotesync.application.report.mapper.ReportMapper;
import com.alten.remotesync.application.report.record.request.AssociateReportDTO;
import com.alten.remotesync.application.report.record.request.CreateAssociateReportDTO;
import com.alten.remotesync.application.report.record.request.PagedReportSearchDTO;
import com.alten.remotesync.application.report.record.request.*;
import com.alten.remotesync.application.report.record.response.PagedReportDTO;
import com.alten.remotesync.application.report.record.response.RcPagedReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import com.alten.remotesync.domain.report.model.Report;
import com.alten.remotesync.domain.report.repository.ReportDomainRepository;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class ReportServiceImp implements ReportService {
    private final ReportDomainRepository reportDomainRepository;
    private final UserDomainRepository userDomainRepository;
    private final ReportMapper reportMapper;

    @Override
    public ReportDTO createAssociateReport(GlobalDTO globalDTO, CreateAssociateReportDTO createAssociateReportDTO) {
        Report report=reportMapper.toAssociateReport(createAssociateReportDTO);
        report.setCreatedBy(userDomainRepository.findById(globalDTO.userId()).get());
        report.setStatus(ReportStatus.PENDING);
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
    public Integer getAssociateTotalReports(GlobalDTO globalDTO) {
        return reportDomainRepository.countAllByCreatedBy_UserId(globalDTO.userId());
    }

    @Override
    public PagedReportDTO getAssociateOldReports(GlobalDTO globalDTO, PagedReportSearchDTO pagedReportSearchDTO) {
        Specification<Report> spec = (root, query, cb) ->
                cb.equal(root.get("createdBy").get("userId"), globalDTO.userId());

        if (pagedReportSearchDTO.title() != null && !pagedReportSearchDTO.title().isBlank()) {
            String title = pagedReportSearchDTO.title().trim().toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("title")), "%" + title + "%")
            );
        }

        if (pagedReportSearchDTO.status() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), pagedReportSearchDTO.status())
            );
        }

        Page<Report> pagedReports = reportDomainRepository.findAll(spec, PageRequest.of(
                pagedReportSearchDTO.pageNumber(),
                (pagedReportSearchDTO.pageSize() != null) ? pagedReportSearchDTO.pageSize() : 10
        ));

        return new PagedReportDTO(pagedReports.getContent().stream().map(reportMapper::toReportDTO).toList(),
                pagedReports.getTotalPages(),
                pagedReports.getTotalElements(),
                pagedReportSearchDTO.pageNumber() + 1,
                pagedReportSearchDTO.pageSize()
        );
    }

    @Override
    public String updateReportStatus(RcUpdateReportDTO rcUpdateReportDTO) {

        Report report = reportDomainRepository.findById(rcUpdateReportDTO.reportId())
                .orElseThrow(() -> new ReportNotFoundException("Report with ID " + rcUpdateReportDTO.reportId() + " not found"));
        report.setStatus(rcUpdateReportDTO.status());
        reportDomainRepository.save(report);
        return "successful report update";
    }


    @Override
    public RcPagedReportDTO getRCPendingReports(PagedGlobalDTO pagedGlobalDTO) {
        Page<Report> pagedReports= reportDomainRepository.findAllByStatus(PageRequest.of(0,6),ReportStatus.PENDING).orElseThrow(()->new ReportNotFoundException("no reports were found"));

        return new RcPagedReportDTO( pagedReports.getContent().stream().map(reportMapper::toReportDTO).toList(), pagedReports.getTotalPages(),
                pagedReports.getTotalElements(), pagedGlobalDTO.pageNumber(), pagedGlobalDTO.pageSize()
                );
    }

    @Override
    public PagedReportDTO getRcPendingReports() {
        Page<Report> pagedReports = reportDomainRepository.findAllByStatus(PageRequest.of(0,6),ReportStatus.PENDING).orElseThrow(()->new ReportNotFoundException("no reports were found"));

        return new PagedReportDTO( pagedReports.getContent().stream().map(reportMapper::toReportDTO).toList(),
                pagedReports.getTotalPages(),
                pagedReports.getTotalElements(),
                1,
                6
        );
    }

    @Override
    public PagedReportDTO getRcReports(PagedReportSearchDTO pagedReportSearchDTO) {
        Specification<Report> spec = Specification.where(null); // Start with empty spec

        if (pagedReportSearchDTO.title() != null && !pagedReportSearchDTO.title().isBlank()) {
            String title = pagedReportSearchDTO.title().trim().toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("title")), "%" + title + "%")
            );
        }

        if (pagedReportSearchDTO.status() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), pagedReportSearchDTO.status())
            );
        }

        if (pagedReportSearchDTO.startDate() != null) {
            LocalDateTime startDateTime = pagedReportSearchDTO.startDate().atStartOfDay();
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("createdAt"), startDateTime)
            );
        }

        int pageNumber = pagedReportSearchDTO.pageNumber() != null ? pagedReportSearchDTO.pageNumber() : 0;
        int pageSize = pagedReportSearchDTO.pageSize() != null ? pagedReportSearchDTO.pageSize() : 10;

        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Report> pagedReports = reportDomainRepository.findAll(spec, pageable);

        return new PagedReportDTO(
                pagedReports.getContent().stream().map(reportMapper::toReportDTO).toList(),
                pagedReports.getTotalPages(),
                pagedReports.getTotalElements(),
                pageNumber + 1,
                pageSize
        );
    }
    @Override
    public RcPagedReportDTO getRCReports(PagedGlobalDTO pagedGlobalDTO) {
        Page<Report> pagedReports = reportDomainRepository.findAllBy(
                        PageRequest.of(pagedGlobalDTO.pageNumber(), (pagedGlobalDTO.pageSize() != null) ? pagedGlobalDTO.pageSize() : 10))
                .orElseThrow(() -> new ReportNotFoundException("Report Not Found"));


        return new RcPagedReportDTO(pagedReports.getContent().stream().map(reportMapper::toReportDTO).toList(),
                pagedReports.getTotalPages(),
                pagedReports.getTotalElements(),
                pagedGlobalDTO.pageNumber() + 1,
                pagedGlobalDTO.pageSize()
        );
    }

    @Override
    public RcPagedReportDTO getRCFilteredReports(ReportFilterDTO reportFilterDTO) {
        Page<Report> pagedReports;
        PageRequest pageRequest = PageRequest.of(reportFilterDTO.pageNumber(), (reportFilterDTO.pageSize() != null) ? reportFilterDTO.pageSize() : 10);
        if (!reportFilterDTO.name().isBlank())
            pagedReports = reportDomainRepository.findAllByName(pageRequest, reportFilterDTO.name()).orElseThrow(() -> new ReportNotFoundException("Report Not Found"));
        else if (reportFilterDTO.startDate() != null && reportFilterDTO.endDate() != null)
            pagedReports = reportDomainRepository.findAllByCreatedAtBetween(
                            pageRequest, LocalDateTime.of(reportFilterDTO.startDate(), LocalTime.MIDNIGHT), LocalDateTime.of(reportFilterDTO.endDate(), LocalTime.MIDNIGHT)
                    )
                    .orElseThrow(() -> new ReportNotFoundException("Report Not Found"));
        else if (reportFilterDTO.status() != null)
            pagedReports = reportDomainRepository.findAllByStatus(pageRequest, reportFilterDTO.status()).orElseThrow(() -> new ReportNotFoundException("Report Not Found"));
        else pagedReports = reportDomainRepository.findAllBy(pageRequest)
                    .orElseThrow(() -> new ReportNotFoundException("Report Not Found"));
        return new RcPagedReportDTO(pagedReports.getContent().stream().map(reportMapper::toReportDTO).toList(),
                pagedReports.getTotalPages(),
                pagedReports.getTotalElements(),
                reportFilterDTO.pageNumber() + 1,
                reportFilterDTO.pageSize()
        );
    }
}
