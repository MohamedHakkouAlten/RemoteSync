package com.alten.remotesync.application.client.service;

import com.alten.remotesync.application.client.mapper.ClientMapper;
import com.alten.remotesync.application.client.record.response.ClientDTO;
import com.alten.remotesync.domain.client.projection.ClientListProjection;
import com.alten.remotesync.domain.client.repository.ClientDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ClientServiceImp implements ClientService {
    private final ClientDomainRepository clientDomainRepository;
    private final ClientMapper clientMapper;

    @Override
    public List<ClientDTO> getClientsList() {
        List<ClientListProjection> clientListProjections = clientDomainRepository.findAllClientBy();
        return clientListProjections.stream().map(clientMapper::toClientDTO).toList();

    }
}
