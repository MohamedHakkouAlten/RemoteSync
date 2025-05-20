package com.alten.remotesync.domain.subFactory.repository;

import com.alten.remotesync.domain.subFactory.model.SubFactory;
import com.alten.remotesync.domain.subFactory.projection.SubFactoryProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubFactoryDomainRepository extends JpaRepository<SubFactory, UUID> {
    Optional<List<SubFactoryProjection>> findAllByFactory_FactoryId(UUID factoryId);
    Optional<List<SubFactoryProjection>> findAllBy();
    @Query("SELECT SUM(sf.capacity) FROM SubFactory sf")
    Long TotalCapacity();
}
