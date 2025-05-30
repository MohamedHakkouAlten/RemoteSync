package com.alten.remotesync.application.client.service;

import com.alten.remotesync.adapter.exception.client.ClientNotFoundException;
import com.alten.remotesync.application.client.mapper.ClientMapper;
import com.alten.remotesync.application.client.record.response.ClientDTO;
import com.alten.remotesync.application.client.record.response.ClientDropDownDTO;
import com.alten.remotesync.domain.client.projection.ClientListProjection;
import com.alten.remotesync.domain.client.repository.ClientDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ClientServiceImp implements ClientService {
    private final ClientDomainRepository clientDomainRepository;
    private final ClientMapper clientMapper;

    @Override
    public List<ClientDropDownDTO> getClientsListByLabel(String label) {

       if(label.isBlank())  return clientDomainRepository.findAllBy(PageRequest.of(0,10)).orElseThrow(()->new ClientNotFoundException("client not found")).stream().map(clientMapper::toClientDropDownDTO).toList();
      return  clientDomainRepository.findTop10ByLabelContainsIgnoreCase(label).orElseThrow(()->new ClientNotFoundException("client not found")).stream().map(clientMapper::toClientDropDownDTO).toList();

    }

    @Override
    public List<ClientDropDownDTO> getRcAllClients() {
        return clientDomainRepository.findAll().stream().map(clientMapper::toClientDropDownDTO).toList();
    }
}
