package com.alten.remotesync.application.subFactory.mapper;

import com.alten.remotesync.application.subFactory.record.response.SubFactoryDropDownDTO;
import com.alten.remotesync.domain.subFactory.projection.SubFactoryProjection;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SubFactoryMapper {
    SubFactoryDropDownDTO toSubFactoryDropDownDTO(SubFactoryProjection subFactoryProjection);
}
