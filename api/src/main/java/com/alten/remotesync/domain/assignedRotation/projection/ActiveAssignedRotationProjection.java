package com.alten.remotesync.domain.assignedRotation.projection;

import com.alten.remotesync.domain.rotation.model.Rotation;
import com.alten.remotesync.domain.user.projection.UserFullNameProjection;

public interface ActiveAssignedRotationProjection {
    UserFullNameProjection getUser();
    Rotation getRotation();
}
