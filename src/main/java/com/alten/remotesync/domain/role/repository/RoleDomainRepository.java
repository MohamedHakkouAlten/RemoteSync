package com.alten.remotesync.domain.role.repository;

import com.alten.remotesync.domain.role.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleDomainRepository extends JpaRepository<Role, Long> {
}
