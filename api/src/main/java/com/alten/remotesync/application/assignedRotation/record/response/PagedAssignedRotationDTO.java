package com.alten.remotesync.application.assignedRotation.record.response;

import java.util.List;

public record PagedAssignedRotationDTO(
        List<AssignedRotationDTO> assignedRotationDTOList,
        Integer totalPages,
        Long totalElements,
        Integer currentPage,
        Integer pageSize
) {
}
