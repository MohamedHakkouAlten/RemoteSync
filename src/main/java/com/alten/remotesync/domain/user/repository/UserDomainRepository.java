package com.alten.remotesync.domain.user.repository;

import com.alten.remotesync.domain.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserDomainRepository extends JpaRepository<User, UUID> {
}
