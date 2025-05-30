package com.alten.remotesync.application.subFactory.record.response;

import java.util.UUID;

public record SubFactoryDropDownDTO(
        UUID subFactoryId,
        String label
) {
}
