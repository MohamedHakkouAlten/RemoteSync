package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.user.record.request.LoginRequestDTO;
import com.alten.remotesync.application.user.record.request.RecoverPasswordDTO;
import com.alten.remotesync.application.user.record.request.ResetPasswordDTO;
import com.alten.remotesync.application.user.record.response.LoginResponseDTO;
import com.alten.remotesync.application.user.service.UserService;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO loginRequestDTO) {;
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(userService.login(loginRequestDTO),
                        HttpStatus.OK));
    }

    @GetMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(userService.refreshToken(userPrincipal),
                        HttpStatus.OK));
    }

    @PostMapping("/recover-password")
    public ResponseEntity<?> recoverPassword(@RequestBody @Valid RecoverPasswordDTO recoverPasswordDTO) throws MessagingException {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(userService.recoverPassword(recoverPasswordDTO),
                        HttpStatus.OK));
    }

    @PutMapping("/reset-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> recoverPassword(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody @Valid ResetPasswordDTO resetPasswordDTO) throws MessagingException {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(userService.resetPassword(GlobalDTO.fromUserId(userPrincipal.userId()), resetPasswordDTO),
                        HttpStatus.OK));
    }
}
