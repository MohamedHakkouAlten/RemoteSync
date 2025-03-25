package com.alten.remotesync.domain.subFactory.repository;

import com.alten.remotesync.domain.subFactory.model.SubFactory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SubFactoryDomainRepository extends JpaRepository<SubFactory, UUID> {
}
