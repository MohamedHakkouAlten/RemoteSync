package com.alten.remotesync.application.rotation.service;

import com.alten.remotesync.application.rotation.record.request.CreateRotationDTO;
import com.alten.remotesync.application.rotation.record.response.RotationResponseDTO;
import org.springframework.stereotype.Service;

@Service
public interface RotationService {
    RotationResponseDTO createRotation(CreateRotationDTO createRotationDTO);
}
