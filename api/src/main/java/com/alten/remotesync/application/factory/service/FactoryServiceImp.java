package com.alten.remotesync.application.factory.service;

import com.alten.remotesync.adapter.exception.factory.FactoryNotFoundException;
import com.alten.remotesync.application.factory.mapper.FactoryMapper;
import com.alten.remotesync.application.factory.record.response.FactoryDropDownDTO;
import com.alten.remotesync.domain.factory.repository.FactoryDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
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

    @Override
    public List<FactoryDropDownDTO> getRcFactoriesByLabel(String label) {
        if(label.isBlank()) return factoryDomainRepository.findAllBy().orElseThrow(()->new FactoryNotFoundException("there are no factories")).stream().map(factoryMapper::toFactoryDropDownDTO).toList();
       else return  factoryDomainRepository.findAllByLabelContainingIgnoreCase(label).orElseThrow(()->new FactoryNotFoundException(" no factories were found")).stream().map(factoryMapper::toFactoryDropDownDTO).toList();
    }
}
