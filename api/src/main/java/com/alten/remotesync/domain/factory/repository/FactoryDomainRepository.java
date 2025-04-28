package com.alten.remotesync.domain.factory.repository;

import com.alten.remotesync.domain.factory.model.Factory;
import com.alten.remotesync.domain.factory.projection.FactoryProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FactoryDomainRepository extends JpaRepository<Factory, UUID> {
    Optional<List<FactoryProjection>> findAllBy();
}
