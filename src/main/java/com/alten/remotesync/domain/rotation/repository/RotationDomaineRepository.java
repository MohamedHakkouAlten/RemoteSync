package com.alten.remotesync.domain.rotation.repository;

import com.alten.remotesync.domain.rotation.model.Rotation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RotationDomaineRepository extends JpaRepository<Rotation, UUID> {
}
