package com.alten.remotesync.domain.report.repository;

import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import com.alten.remotesync.domain.report.model.Report;
import com.alten.remotesync.domain.report.projection.ReportProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReportDomainRepository extends JpaRepository<Report, UUID> {
    Optional<Page<Report>> findAllByCreatedBy_UserId(UUID createdByUserId, Pageable pageable);
    Optional<Page<ReportProjection>> findAllBy(Pageable pageable);
    Optional<Page<ReportProjection>> findAllByStatus(Pageable pageable,ReportStatus status);
    @Query("""
            SELECT r
            FROM Report r 
            WHERE r.createdAt >= :startDate AND r.createdAt <= :endDate
            """)
    Optional<Page<ReportProjection>> findAllByCreatedAtBetween(Pageable pageable, LocalDateTime startDate, LocalDateTime endDate);
    @Query("""
            SELECT r
            FROM Report r 
            INNER JOIN r.createdBy ur
            WHERE LOWER(CONCAT(ur.firstName, ' ', ur.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))
            """)
    Optional<Page<ReportProjection>> findAllByName(Pageable pageable, String name);
}
