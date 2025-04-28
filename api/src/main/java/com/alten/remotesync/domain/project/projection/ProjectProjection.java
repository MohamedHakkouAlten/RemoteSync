package com.alten.remotesync.domain.project.projection;

import java.util.UUID;

public interface ProjectProjection {
    UUID getProjectId();
    String getLabel();
}
