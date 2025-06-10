package com.alten.remotesync.domain.user.repository;

import com.alten.remotesync.domain.role.model.Role;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.projection.UserProjection;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserDomainRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);


    Integer countAllByRoles(List<Role> roles);
    @Query("SELECT u FROM User u WHERE LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))")
    Optional<List<UserProjection>> findTop10ByFullNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);
}
