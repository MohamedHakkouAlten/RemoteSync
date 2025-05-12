package com.alten.remotesync.domain.user.projection;

import java.util.UUID;

public interface UserProjection {
    UUID getUserId();
    String getFirstName();
    String getLastName();
}
