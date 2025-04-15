package com.alten.remotesync.domain.client.repository;

import com.alten.remotesync.domain.client.model.Client;
import com.alten.remotesync.domain.client.projection.ClientListProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface ClientDomainRepository extends JpaRepository<Client, UUID> {


    List<ClientListProjection> findAllClientBy();
}
