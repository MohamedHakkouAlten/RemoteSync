package com.alten.remotesync.application.client.service;


import com.alten.remotesync.application.client.record.response.ClientDropDownDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ClientService {
    List<ClientDropDownDTO> getClientsListByLabel(String label);
}
