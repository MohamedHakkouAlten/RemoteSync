package com.alten.remotesync.application.client.service;

import com.alten.remotesync.application.client.record.response.ClientDTO;
import com.alten.remotesync.application.client.record.response.PagedClientsDTO;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalIdDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ClientService {
    List<ClientDTO> getClientsList();
}
