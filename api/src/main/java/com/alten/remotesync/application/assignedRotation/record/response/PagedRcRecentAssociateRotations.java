package com.alten.remotesync.application.assignedRotation.record.response;

import lombok.Builder;

import java.util.List;

@Builder
public record PagedRcRecentAssociateRotations(
        List<RcRecentAssociateRotations> rcAllRecentAssociateRotations,
        Integer totalPages,
        Long totalElements,
        Integer currentPage,
        Integer pageSize
) {
}
