package com.alten.remotesync.domain.factory.projection;

import java.util.UUID;

public interface FactoryProjection {
    UUID getFactoryId();
    String getLabel();
}
