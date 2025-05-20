package com.alten.remotesync.domain.assignedRotation.repository;

import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.embeddable.AssignedRotationId;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;

import com.alten.remotesync.domain.assignedRotation.projection.ActiveAssignedRotationProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssignedRotationDomainRepository extends JpaRepository<AssignedRotation, AssignedRotationId> {
    Optional<AssignedRotation> findAssignedRotationByUser_UserIdAndProject_ProjectIdAndRotationAssignmentStatus(UUID user_userId, UUID project_projectId, RotationAssignmentStatus rotationAssignmentStatus, Sort sort);
    Optional<List<AssignedRotation>> findAllAssignedRotationByUser_UserIdAndProject_ProjectIdAndRotationAssignmentStatus(UUID user_userId, UUID project_projectId, RotationAssignmentStatus rotationAssignmentStatus, Sort sort);
    Optional<AssignedRotation> findAssignedRotationByUser_UserIdAndProjectIsNullAndRotationAssignmentStatus(UUID user_userId, RotationAssignmentStatus rotationAssignmentStatus, Sort sort);
    Optional<List<AssignedRotation>> findAllAssignedRotationByUser_UserIdAndRotationAssignmentStatus(UUID user_userId, RotationAssignmentStatus rotationAssignmentStatus, Sort sort);


    Page<AssignedRotation> findAllByUser_SubFactory_SubFactoryID(UUID subFactoryId, Pageable pageable);
    Page<AssignedRotation> findAllByProject_Owner_ClientId(UUID clientId, Pageable pageable);
    Page<ActiveAssignedRotationProjection> findAllByRotationAssignmentStatus(RotationAssignmentStatus status, Pageable pageable);
    Optional<AssignedRotation> findByUser_UserIdAndRotationAssignmentStatus(UUID userID,RotationAssignmentStatus status);
    @Query(value = "SELECT ar FROM AssignedRotation ar " +
            "INNER JOIN ar.user ur " +
            "WHERE ar.rotationAssignmentStatus = :status " +
            "AND CONCAT(ur.firstName, ' ', ur.lastName) LIKE %:name%"
           )
    Page<ActiveAssignedRotationProjection> findActiveAssignedRotationByName(
            @Param("status") RotationAssignmentStatus status,
            Pageable pageable,
            @Param("name") String name);
    Page<ActiveAssignedRotationProjection> findAllByRotationAssignmentStatusAndProject_ProjectId(RotationAssignmentStatus status, Pageable pageable,UUID projectId);
    Page<ActiveAssignedRotationProjection> findAllByRotationAssignmentStatusAndProject_Owner_ClientId(RotationAssignmentStatus status, Pageable pageable,UUID clientId);
    Page<ActiveAssignedRotationProjection> findAllByRotationAssignmentStatusAndUser_SubFactory_Factory_FactoryId(RotationAssignmentStatus status, Pageable pageable,UUID factoryId);
    Page<ActiveAssignedRotationProjection> findAllByRotationAssignmentStatusAndUser_SubFactory_SubFactoryID(RotationAssignmentStatus status, Pageable pageable,UUID subFactoryId);

    @Query(value = """
    SELECT COUNT(ar)
    FROM AssignedRotation ar
    INNER JOIN ar.rotation r
    LEFT JOIN r.customDates cd
    WHERE ar.rotationAssignmentStatus = 'ACTIVE'
      AND (
            (cd.date = :targetDate AND cd.rotationStatus = 'ONSITE')
            OR
            (
              (cd.date IS NULL OR cd.date <> :targetDate)
              AND MOD(
                    ABS(
                        FLOOR(
                            FUNCTION('DATEDIFF', :targetDate, r.startDate)
                        )
                    ),
                    r.cycle
                  ) < r.shift
            )
          )
    """)
    Long countActiveRotationsForByDate(@Param("targetDate") LocalDate targetDate);


}
