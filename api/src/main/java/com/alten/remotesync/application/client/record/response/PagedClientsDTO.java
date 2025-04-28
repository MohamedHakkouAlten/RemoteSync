package com.alten.remotesync.application.client.record.response;

import com.alten.remotesync.application.project.record.response.ProjectDTO;
import com.alten.remotesync.domain.client.model.Client;
import com.alten.remotesync.domain.client.projection.ClientListProjection;

import java.util.List;

public record PagedClientsDTO(
        List<ClientListProjection> clients,
        Integer totalPages,
        Long totalElements,
        Integer currentPage,
        Integer pageSize
) {
}
