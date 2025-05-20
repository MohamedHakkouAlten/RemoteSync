package com.alten.remotesync.domain.report.projection;

import com.alten.remotesync.domain.report.enumeration.ReportStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public interface ReportProjection {
     UUID getReportId();

     String getTitle();

     String getDescription();

     ReportStatus getStatus();

     ReportUserProjection getCreatedBy();


     LocalDateTime getCreatedAt();
}
