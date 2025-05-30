package com.alten.remotesync.application.subFactory.service;

import com.alten.remotesync.adapter.exception.subFactory.SubFactoryNotFoundException;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.subFactory.mapper.SubFactoryMapper;
import com.alten.remotesync.application.subFactory.record.response.RcSubFactoriesCapacityCountDTO;
import com.alten.remotesync.application.subFactory.record.response.SubFactoryDropDownDTO;
import com.alten.remotesync.domain.subFactory.repository.SubFactoryDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SubFactoryServiceImp implements SubFactoryService {
    private final SubFactoryDomainRepository subFactoryDomainRepository;
    private final SubFactoryMapper subFactoryMapper;

    @Override
    public List<SubFactoryDropDownDTO> getRcSubFactories() {

        return subFactoryDomainRepository.findAllBy().orElseThrow(()->new SubFactoryNotFoundException("there are no subFactories")).stream().map(subFactoryMapper::toSubFactoryDropDownDTO).toList();
    }

    @Override
    public RcSubFactoriesCapacityCountDTO getRcSubFactoriesTotalCapacity() {
        return subFactoryMapper.toRcSubFactoriesCountDto(subFactoryDomainRepository.TotalCapacity());
    }

    @Override
    public List<SubFactoryDropDownDTO> getRcAllSubFactoriesByFactory(GlobalDTO globalDTO) {
        return subFactoryDomainRepository.findAllByFactory_FactoryId(globalDTO.factoryId()).orElseThrow().stream().map(subFactoryMapper::toSubFactoryDropDownDTO).toList();
    }
}
