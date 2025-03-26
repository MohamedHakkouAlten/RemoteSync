package com.alten.remotesync.domain.report.repository;

import com.alten.remotesync.domain.report.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReportDomainRepository extends JpaRepository<Report, UUID> {
}
