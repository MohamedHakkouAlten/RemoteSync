package com.alten.remotesync.domain.assignedRotation.repository;

import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.embeddable.AssignedRotationId;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssignedRotationDomainRepository extends JpaRepository<AssignedRotation, AssignedRotationId> {
    Optional<AssignedRotation> findAssignedRotationByUser_UserIdAndProject_ProjectIdAndRotationAssignmentStatus(UUID user_userId, UUID project_projectId, RotationAssignmentStatus rotationAssignmentStatus, Sort sort);
    Optional<List<AssignedRotation>> findAllAssignedRotationByUser_UserIdAndProject_ProjectIdAndRotationAssignmentStatus(UUID user_userId, UUID project_projectId, RotationAssignmentStatus rotationAssignmentStatus, Sort sort);
    Optional<AssignedRotation> findAssignedRotationByUser_UserIdAndProjectIsNullAndRotationAssignmentStatus(UUID user_userId, RotationAssignmentStatus rotationAssignmentStatus, Sort sort);
    Optional<List<AssignedRotation>> findAllAssignedRotationByUser_UserIdAndRotationAssignmentStatus(UUID user_userId, RotationAssignmentStatus rotationAssignmentStatus, Sort sort);
    @Query("SELECT ar FROM AssignedRotation ar " +
            "JOIN FETCH ar.user u " +
            "JOIN FETCH ar.rotation r " +
            "LEFT JOIN FETCH ar.project p " +
            "WHERE u.subFactory.subFactoryID = :subFactoryId")
    Page<AssignedRotation> findByUser_SubFactory_SubFactoryID(@Param("subFactoryId") UUID subFactoryId, Pageable pageable);
    @Query("SELECT ar FROM AssignedRotation ar " +
            "JOIN FETCH ar.user u " +
            "JOIN FETCH ar.rotation r " +
            "LEFT JOIN FETCH ar.project p " +
            "WHERE p.owner.clientId = :clientId")
    Page<AssignedRotation> findByClient_ClientId(@Param("clientId") UUID clientId, Pageable pageable);

}
