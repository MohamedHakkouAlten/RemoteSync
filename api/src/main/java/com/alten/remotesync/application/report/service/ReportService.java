package com.alten.remotesync.application.report.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalDTO;
import com.alten.remotesync.application.report.record.request.*;
import com.alten.remotesync.application.report.record.response.PagedReportDTO;
import com.alten.remotesync.application.report.record.response.RcPagedReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import org.springframework.stereotype.Service;

@Service
public interface ReportService {
    ReportDTO createAssociateReport(GlobalDTO globalDTO, CreateAssociateReportDTO createAssociateReportDTO);
    PagedReportDTO getAssociateReports(AssociateReportDTO associateReportDTO);
    Integer getAssociateTotalReports(GlobalDTO globalDTO);
    PagedReportDTO getAssociateOldReports(GlobalDTO globalDTO, PagedReportSearchDTO pagedReportSearchDTO);
    RcPagedReportDTO getRCReports(PagedGlobalDTO pagedGlobalDTO);
    RcPagedReportDTO getRCReportsByStatus(RCReportByStatusDTO rcReportByStatusDTO);
    RcPagedReportDTO getRCReportsByDateRange(RCReportByDateRangeDTO rcReportByDateRangeDTO);
    RcPagedReportDTO getRCReportsByUser(RCReportByUserDTO rcReportByUserDTO);
    String rcUpdateReportStatus(RcUpdateReportDTO rcUpdateReportDTO);
    RcPagedReportDTO getRCPendingReports(PagedGlobalDTO pagedGlobalDTO);

    PagedReportDTO getRcPendingReports();
    PagedReportDTO getRcReports(PagedReportSearchDTO pagedReportSearchDTO);

}
