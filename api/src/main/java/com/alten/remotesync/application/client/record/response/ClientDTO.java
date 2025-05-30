package com.alten.remotesync.application.client.record.response;

import java.util.UUID;

public record ClientDTO(
        UUID clientId,
        String label
) {
}
