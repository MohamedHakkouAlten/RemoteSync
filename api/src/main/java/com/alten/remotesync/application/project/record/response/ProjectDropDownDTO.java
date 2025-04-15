package com.alten.remotesync.application.project.record.response;

import java.util.UUID;

public record ProjectDropDownDTO(
        UUID projectId,
        String label
) {
}
