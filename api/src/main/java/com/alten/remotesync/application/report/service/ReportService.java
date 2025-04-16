package com.alten.remotesync.application.report.service;

import com.alten.remotesync.application.globalDTO.PagedGlobalIdDTO;
import com.alten.remotesync.application.report.record.request.AssociateReportDTO;
import com.alten.remotesync.application.report.record.request.CreateAssociateReportDTO;
import com.alten.remotesync.application.report.record.response.PagedReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface ReportService {
    ReportDTO createAssociateReport(CreateAssociateReportDTO createAssociateReportDTO);
    PagedReportDTO getAssociateReports(AssociateReportDTO associateReportDTO);
    PagedReportDTO getRcReports(PagedGlobalIdDTO pagedGlobalIdDTO);
    ReportDTO updateReportStatus(UUID reportId, ReportStatus status);
}
