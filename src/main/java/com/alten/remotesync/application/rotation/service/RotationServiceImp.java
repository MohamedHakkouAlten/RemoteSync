package com.alten.remotesync.application.rotation.service;

import com.alten.remotesync.domain.rotation.repository.RotationDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RotationServiceImp implements RotationService {
    private final RotationDomainRepository rotationDomainRepository;
}
