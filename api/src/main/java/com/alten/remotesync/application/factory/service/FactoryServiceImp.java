package com.alten.remotesync.application.factory.service;

import com.alten.remotesync.adapter.exception.factory.FactoryNotFoundException;
import com.alten.remotesync.application.factory.mapper.FactoryMapper;
import com.alten.remotesync.application.factory.record.response.FactoryDropDownDTO;
import com.alten.remotesync.domain.factory.repository.FactoryDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FactoryServiceImp implements FactoryService {
    private final FactoryDomainRepository factoryDomainRepository;
    private final FactoryMapper factoryMapper;

    @Override
    public Long getTotalFactoriesCount() {
       return factoryDomainRepository.count();

    }

    @Override
    public List<FactoryDropDownDTO> getRcFactories() {
        return factoryDomainRepository.findAllBy().orElseThrow(() -> new FactoryNotFoundException("Not Found")).stream().map(factoryMapper::toFactoryDropDownDTO).toList();
    }
}
