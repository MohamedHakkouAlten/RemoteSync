package com.alten.remotesync.application.assignedRotation.record.request;

import java.util.UUID;

public record PagedRotationsSearchDTO(
        Integer pageNumber,
        Integer pageSize,
        String label,
        UUID clientId,
        UUID projectId,
        UUID factoryId,
        UUID subFactoryId
) {
}
