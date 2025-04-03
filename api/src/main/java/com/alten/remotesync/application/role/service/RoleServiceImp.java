package com.alten.remotesync.application.role.service;

import com.alten.remotesync.domain.role.repository.RoleDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleServiceImp implements RoleService {
    private final RoleDomainRepository roleDomainRepository;
}
