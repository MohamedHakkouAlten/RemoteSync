package com.alten.remotesync.application.assignedRotation.record.response;

import java.time.LocalDate;
import java.util.List;

public record OnSiteWeeksDTO(
        Integer totalOnSiteWeeks,
        List<LocalDate> onSiteDates
) {
}
