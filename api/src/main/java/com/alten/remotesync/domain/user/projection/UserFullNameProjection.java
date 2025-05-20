package com.alten.remotesync.domain.user.projection;

import java.util.UUID;

public interface UserFullNameProjection {
    UUID getUserId();
    String  getFirstName();
    String getLastName();
}
