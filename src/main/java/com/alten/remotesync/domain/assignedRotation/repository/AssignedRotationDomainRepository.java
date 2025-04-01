package com.alten.remotesync.domain.assignedRotation.repository;

import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.embeddable.AssignedRotationId;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssignedRotationDomainRepository extends JpaRepository<AssignedRotation, AssignedRotationId> {
    Optional<AssignedRotation> findAssignedRotationByUser_UserIdAndProject_ProjectIdAndRotationAssignmentStatus(UUID user_userId, UUID project_projectId, RotationAssignmentStatus rotationAssignmentStatus, Sort sort);
    Optional<AssignedRotation> findAssignedRotationByUser_UserIdAndProjectIsNullAndRotationAssignmentStatus(UUID user_userId, RotationAssignmentStatus rotationAssignmentStatus, Sort sort);
}
