package com.alten.remotesync.domain.log.repository;

import com.alten.remotesync.domain.log.model.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LogDomainRepository extends JpaRepository<Log, UUID> {
}
