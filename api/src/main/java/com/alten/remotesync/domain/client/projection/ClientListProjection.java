package com.alten.remotesync.domain.client.projection;

import java.util.UUID;


public interface ClientListProjection {
    UUID getClientId();
    String getLabel();
}
