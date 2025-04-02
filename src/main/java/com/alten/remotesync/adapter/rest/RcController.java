package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.application.rotation.record.request.CreateRotationDTO;
import com.alten.remotesync.application.rotation.record.response.RotationResponseDTO;
import com.alten.remotesync.application.rotation.service.RotationService;
import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rc")
@RequiredArgsConstructor
public class RcController {

    private final RotationService rotationService;

    @PostMapping("/rotation/create")
    @PreAuthorize("hasAuthority('RC:WRITE')")
    public ResponseEntity<?> createRotation(@RequestBody @Valid CreateRotationDTO createRotationDTO) {
        RotationResponseDTO responseDTO = rotationService.createRotation(createRotationDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseWrapper.success(responseDTO, HttpStatus.CREATED));
    }
}
