package com.alten.remotesync.application.report.service;

import com.alten.remotesync.application.report.record.request.AssociateReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import org.springframework.stereotype.Service;

@Service
public interface ReportService {

    ReportDTO createAssociateReport(AssociateReportDTO associateReportDTO);
}
