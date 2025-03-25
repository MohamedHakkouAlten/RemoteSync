package com.alten.remotesync.domain.rotation.repository;

import com.alten.remotesync.domain.rotation.model.Rotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RotationDomaineRepository extends JpaRepository<Rotation, UUID> {
}
