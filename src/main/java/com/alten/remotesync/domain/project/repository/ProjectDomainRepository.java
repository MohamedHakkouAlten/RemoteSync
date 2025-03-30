package com.alten.remotesync.domain.project.repository;


import com.alten.remotesync.domain.project.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectDomainRepository extends JpaRepository<Project, UUID> {
    @Query("SELECT COUNT(DISTINCT ar.project.projectId) FROM AssignedRotation ar " +
            "WHERE ar.user.userId = :userId AND ar.project.projectId IS NOT NULL")
    Optional<Integer> fetchAssociateProjectsCount(@Param("userId") UUID userId);
    @Query("SELECT p FROM AssignedRotation ar " +
            "INNER JOIN Project p ON p.projectId = ar.project.projectId " +
            "INNER JOIN Client c ON c.clientId = p.owner.clientId " +
            "WHERE ar.user.userId = :userId " +
            "AND ar.project.projectId IS NOT NULL " +
            "AND p.label LIKE %:label% "+
            "AND p.status IN ('COMPLETED', 'CANCELLED') " +
            "GROUP BY ar.project.projectId"
    )
    Optional<Page<Project>> fetchAssociateOldProjectsByLabel(@Param("userId") UUID userId, @Param("label") String label, Pageable pageable);

    @Query("SELECT p FROM AssignedRotation ar " +
            "INNER JOIN Project p ON p.projectId = ar.project.projectId " +
            "INNER JOIN Client c ON c.clientId = p.owner.clientId " +
            "WHERE ar.user.userId = :userId " +
            "AND ar.project.projectId IS NOT NULL " +
            "AND p.status IN ('COMPLETED', 'CANCELLED') " +
            "GROUP BY ar.project.projectId"
    )
    Optional<Page<Project>> fetchAssociateOldProjects(@Param("userId") UUID userId,Pageable pageable);

    @Query("SELECT p FROM AssignedRotation ar " +
            "INNER JOIN Project p ON p.projectId = ar.project.projectId " +
            "INNER JOIN Client c ON c.clientId = p.owner.clientId " +
            "WHERE ar.user.userId = :userId " +
            "AND p.owner.clientId= :clientId "+
            "AND ar.project.projectId IS NOT NULL " +
            "AND p.status IN ('COMPLETED', 'CANCELLED') " +
            "GROUP BY ar.project.projectId"
    )
    Optional<Page<Project>> fetchAssociateOldProjectsByClient(@Param("userId") UUID userId,@Param("clientId") UUID clientId,Pageable pageable);


}
