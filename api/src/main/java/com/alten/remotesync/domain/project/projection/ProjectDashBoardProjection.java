package com.alten.remotesync.domain.project.projection;

import com.alten.remotesync.domain.project.enumeration.ProjectStatus;

import java.time.LocalDate;
import java.util.UUID;

public interface ProjectDashBoardProjection {
    UUID getProjectId();

    String getLabel();

    String getTitre();

    ProjectStatus getStatus();

    LocalDate getDeadLine();
    LocalDate getStartDate();
}
