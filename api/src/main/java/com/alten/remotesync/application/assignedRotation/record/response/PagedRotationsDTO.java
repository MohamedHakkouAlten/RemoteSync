package com.alten.remotesync.application.assignedRotation.record.response;

import java.util.List;

public record PagedRotationsDTO(
        List<?> assignedRotations,
        Integer totalPages,
        Long totalElements,
        Integer currentPage,
        Integer pageSize
) {
}
