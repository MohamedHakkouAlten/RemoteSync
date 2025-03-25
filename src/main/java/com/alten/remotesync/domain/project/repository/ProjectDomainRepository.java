package com.alten.remotesync.domain.project.repository;

import com.alten.remotesync.domain.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProjectDomainRepository extends JpaRepository<Project, UUID> {
}
