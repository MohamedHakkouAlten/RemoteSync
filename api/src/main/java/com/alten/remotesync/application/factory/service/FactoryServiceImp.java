package com.alten.remotesync.application.factory.service;

import com.alten.remotesync.domain.factory.repository.FactoryDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FactoryServiceImp implements FactoryService {
    private final FactoryDomainRepository factoryDomainRepository;
}
