package com.alten.remotesync.application.factory.mapper;

import com.alten.remotesync.application.factory.record.response.FactoryDropDownDTO;
import com.alten.remotesync.domain.factory.projection.FactoryProjection;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FactoryMapper {
    FactoryDropDownDTO toFactoryDropDownDTO(FactoryProjection factoryProjection);
}
