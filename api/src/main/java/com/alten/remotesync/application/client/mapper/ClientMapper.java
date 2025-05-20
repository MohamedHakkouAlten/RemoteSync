package com.alten.remotesync.application.client.mapper;

import com.alten.remotesync.application.client.record.response.ClientDTO;
import com.alten.remotesync.application.client.record.response.ClientDropDownDTO;
import com.alten.remotesync.domain.client.model.Client;
import com.alten.remotesync.domain.client.projection.ClientListProjection;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientDTO toClientDTO(Client client);
    ClientDropDownDTO toClientDropDownDTO(ClientListProjection clientListProjection);

}
