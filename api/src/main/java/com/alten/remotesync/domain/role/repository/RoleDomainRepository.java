package com.alten.remotesync.domain.role.repository;

import com.alten.remotesync.domain.role.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleDomainRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByAuthority(String authority);
}
