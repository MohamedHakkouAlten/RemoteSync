package com.alten.remotesync.domain.client.repository;

import com.alten.remotesync.domain.client.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ClientDomainRepository extends JpaRepository<Client, UUID> {
}
