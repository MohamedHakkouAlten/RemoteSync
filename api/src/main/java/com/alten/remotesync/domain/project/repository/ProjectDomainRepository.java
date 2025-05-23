package com.alten.remotesync.domain.project.repository;

import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.project.projection.ProjectDashBoardProjection;
import com.alten.remotesync.domain.project.projection.ProjectLargestMembersProjection;
import com.alten.remotesync.domain.project.projection.ProjectMembersProjection;
import com.alten.remotesync.domain.project.projection.ProjectProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectDomainRepository extends JpaRepository<Project, UUID> {
    Optional<List<ProjectProjection>> findAllByOwner_ClientId(UUID clientId);

    Optional<List<ProjectProjection>> findTop10ByLabelContainsIgnoreCase(String label);
    Optional<List<ProjectProjection>> findAllBy(Pageable pageable);

    @Query("SELECT p FROM AssignedRotation ar " +
            "INNER JOIN Project p ON p.projectId = ar.project.projectId " +
            "INNER JOIN Client c ON c.clientId = p.owner.clientId " +
            "WHERE ar.user.userId = :userId " +
            "AND ar.project.projectId IS NOT NULL " +
            "AND p.status = 'ACTIVE' " +
            "GROUP BY ar.project.projectId"
    )
    Optional<Project> fetchAssociateCurrentProject(@Param("userId") UUID userId);

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

    @Query("SELECT p from Project p ORDER by p.deadLine-p.startDate DESC LIMIT 1")
    Optional<ProjectDashBoardProjection> findLongestDurationProject();

    Integer countDistinctByStatusEquals(ProjectStatus status);

    @Query("SELECT p FROM AssignedRotation ar " +
            "JOIN Project p ON p.projectId = ar.project.projectId " +
            "INNER JOIN Client c ON c.clientId = p.owner.clientId " +
            "WHERE ar.user.userId = :userId " +
            "AND ar.project.projectId IS NOT NULL " +
            "GROUP BY ar.project.projectId")
    Optional<Page<Project>> fetchAssociateProjects(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT DISTINCT p FROM AssignedRotation ar " +
            "INNER JOIN Project p ON p.projectId = ar.project.projectId " +
            "INNER JOIN Client c ON c.clientId = p.owner.clientId " +
            "WHERE ar.user.userId = :userId " +
            "GROUP BY p.projectId " +
            "ORDER BY COUNT(DISTINCT ar.user.userId) DESC")
    Optional<Project> fetchProjectWithLargestTeam(@Param("userId") UUID userId);


    @Query(value = """ 
                  SELECT
                   p.projectId AS projectId,
                    p.label AS label,
                    p.titre AS titre,
                    p.status AS status,
                    p.deadLine AS deadLine,
                    p.startDate AS startDate,             
                    COUNT(DISTINCT ur.userId) AS usersCount
                    FROM AssignedRotation ar
                  INNER JOIN ar.project p 
                  INNER JOIN  ar.user ur 
                  GROUP BY   p
                  ORDER BY  usersCount DESC Limit 1
            """)
    Optional<ProjectLargestMembersProjection> fetchRCProjectWithLargestTeam();
    @Query(value = """
        SELECT
           CONCAT(SUBSTRING(ur.firstName, 1, 1), SUBSTRING(ur.lastName, 1, 1)) AS initials
           
        FROM
            AssignedRotation ar
        INNER JOIN
            ar.user ur
        WHERE
            ar.project.projectId = :projectId
        GROUP BY   ur.userId
         ORDER By ur.userId DESC Limit 5
     
        """)
    Optional<List<ProjectMembersProjection>> findFirst5UsersByProject(@Param("projectId") UUID projectId);
}
