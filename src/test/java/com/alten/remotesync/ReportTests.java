package com.alten.remotesync;

import com.alten.remotesync.application.report.record.request.AssociateReportDTO;
import com.alten.remotesync.application.report.record.request.CreateAssociateReportDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.application.report.service.ReportService;
import com.alten.remotesync.domain.report.enumeration.ReportType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class ReportTests {
    @Autowired
    private ReportService reportService;

    @Test
    public void TestCreateReport() {
        ReportDTO reportDTO = reportService.createAssociateReport(new CreateAssociateReportDTO("Request to work remote next week",
                "i m going to be sick next week", ReportType.REQUEST_ROTATION));
        assertThat(reportDTO).isNotNull();
    }


}
