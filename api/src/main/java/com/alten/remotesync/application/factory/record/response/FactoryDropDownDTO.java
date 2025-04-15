package com.alten.remotesync.application.factory.record.response;

import java.util.UUID;

public record FactoryDropDownDTO(
        UUID factoryId,
        String label
) {
}
