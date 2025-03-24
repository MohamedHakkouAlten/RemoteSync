package com.alten.remotesync.domain.privilege.repository;

import com.alten.remotesync.domain.privilege.model.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrivilegeDomainRepository extends JpaRepository<Privilege, Long> {
}
