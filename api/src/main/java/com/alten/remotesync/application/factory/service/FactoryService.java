package com.alten.remotesync.application.factory.service;

import com.alten.remotesync.application.factory.record.response.FactoryDropDownDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FactoryService {
    Long getTotalFactoriesCount();
    List<FactoryDropDownDTO> getRcFactories();
    List<FactoryDropDownDTO> getRcFactoriesByLabel(String label);
}
