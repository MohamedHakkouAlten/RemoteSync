package com.alten.remotesync.application.subFactory.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.subFactory.record.response.RcSubFactoriesCapacityCountDTO;
import com.alten.remotesync.application.subFactory.record.response.SubFactoryDropDownDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SubFactoryService {
    List<SubFactoryDropDownDTO> getRcSubFactories();

    RcSubFactoriesCapacityCountDTO getRcSubFactoriesTotalCapacity();

    List<SubFactoryDropDownDTO> getRcAllSubFactoriesByFactory(GlobalDTO globalDTO);
}
