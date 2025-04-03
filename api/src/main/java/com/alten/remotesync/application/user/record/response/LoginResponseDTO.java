package com.alten.remotesync.application.user.record.response;

public record LoginResponseDTO(
        String accessToken,
        String refreshToken
) {}
