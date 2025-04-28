package com.alten.remotesync.domain.report.repository;

import com.alten.remotesync.domain.report.model.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReportDomainRepository extends JpaRepository<Report, UUID> {
    Optional<Page<Report>> findAllByCreatedBy_UserId(UUID createdByUserId, Pageable pageable);
    Optional<Page<Report>> findAllBy(Pageable pageable);
}
