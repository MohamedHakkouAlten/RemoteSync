package com.alten.remotesync.application.privilege.service;

import com.alten.remotesync.domain.privilege.repository.PrivilegeDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PrivilegeServiceImp implements PrivilegeService {
    private final PrivilegeDomainRepository privilegeDomainRepository;
}
