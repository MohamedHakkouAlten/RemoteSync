package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import com.alten.remotesync.application.user.record.request.LoginRequestDTO;
import com.alten.remotesync.application.user.record.response.LoginResponseDTO;
import com.alten.remotesync.application.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO loginRequestDTO) {
        LoginResponseDTO response = userService.login(loginRequestDTO);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(response, HttpStatus.OK));
    }}
