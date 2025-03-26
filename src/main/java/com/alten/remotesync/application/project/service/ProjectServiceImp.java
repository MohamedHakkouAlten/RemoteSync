package com.alten.remotesync.application.project.service;

import com.alten.remotesync.domain.project.repository.ProjectDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProjectServiceImp implements ProjectService {
    private final ProjectDomainRepository projectDomainRepository;
}
