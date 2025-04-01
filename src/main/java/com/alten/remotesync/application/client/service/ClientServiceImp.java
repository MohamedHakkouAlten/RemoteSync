package com.alten.remotesync.application.client.service;

import com.alten.remotesync.domain.client.repository.ClientDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ClientServiceImp implements ClientService {
    private final ClientDomainRepository clientDomainRepository;
}
