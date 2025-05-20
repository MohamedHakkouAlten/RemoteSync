package com.alten.remotesync.application.report.service;

import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
import com.alten.remotesync.application.report.record.request.*;
import com.alten.remotesync.application.report.record.response.PagedReportDTO;
import com.alten.remotesync.application.report.record.response.RCPagedReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface ReportService {
    ReportDTO createAssociateReport(CreateAssociateReportDTO createAssociateReportDTO);
    PagedReportDTO getAssociateReports(AssociateReportDTO associateReportDTO);
    RCPagedReportDTO getRCReports(PagedGlobalDTO pagedGlobalDTO);
    RCPagedReportDTO getRCReportsByStatus(RCReportByStatusDTO rcReportByStatusDTO);
    RCPagedReportDTO getRCReportsByDateRange(RCReportByDateRangeDTO rcReportByDateRangeDTO);
    RCPagedReportDTO getRCReportsByUser(RCReportByUserDTO rcReportByUserDTO);
    String updateReportStatus(RCUpdateReportDTO rcUpdateReportDTO);
    RCPagedReportDTO getRCPendingReports(PagedGlobalDTO pagedGlobalDTO);

}
