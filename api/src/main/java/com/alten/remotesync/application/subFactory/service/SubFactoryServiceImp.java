package com.alten.remotesync.application.subFactory.service;

import com.alten.remotesync.domain.subFactory.repository.SubFactoryDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubFactoryServiceImp implements SubFactoryService {
    private final SubFactoryDomainRepository subFactoryDomainRepository;
}
