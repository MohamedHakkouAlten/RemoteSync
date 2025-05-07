package com.alten.remotesync.application.assignedRotation.record.response;

import com.alten.remotesync.domain.user.model.User;

import java.util.Date;
import java.util.List;

public record ActiveRotationsDTO(
        User user,
        List<Date> customDates


) {
}
