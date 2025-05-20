package com.alten.remotesync.application.factory.record.response;

import com.alten.remotesync.application.project.record.response.ProjectDashBoardDTO;
import com.alten.remotesync.application.project.record.response.ProjectLargestMembersDTO;
import com.alten.remotesync.application.report.record.response.ReportDTO;
import com.alten.remotesync.application.report.record.response.ReportProjectionDTO;
import com.alten.remotesync.domain.report.projection.ReportProjection;

import java.util.List;


public record RCDashBoardDTO(
        Long activeProjectCount,
        Long completedProjectCount,
        Long totalSites,
        Long totalCapacity,
        Long totalOnSiteAssociates,
        ProjectDashBoardDTO longestDurationProject,
        ProjectLargestMembersDTO largestMembersProject,
        List<ReportProjectionDTO> pendingReports

) {
}
