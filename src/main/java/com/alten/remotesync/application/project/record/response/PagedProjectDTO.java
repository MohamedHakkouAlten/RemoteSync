package com.alten.remotesync.application.project.record.response;



import java.util.List;

public record PagedProjectDTO(
        List<ProjectDTO> projectDTOS,
        Integer totalPages,
        Long totalElements,
        Integer currentPage,
        Integer pageSize
) {

}
