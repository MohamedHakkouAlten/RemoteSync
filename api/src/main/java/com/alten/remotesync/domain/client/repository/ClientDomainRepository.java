package com.alten.remotesync.domain.client.repository;

import com.alten.remotesync.domain.client.model.Client;
import com.alten.remotesync.domain.client.projection.ClientListProjection;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClientDomainRepository extends JpaRepository<Client, UUID> {

    Optional<List<ClientListProjection>> findAllBy(Pageable pageable);

    Optional<List<ClientListProjection>> findTop10ByLabelContainsIgnoreCase(String label);
}
