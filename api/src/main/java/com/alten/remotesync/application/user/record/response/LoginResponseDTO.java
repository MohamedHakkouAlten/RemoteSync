package com.alten.remotesync.application.user.record.response;

import java.util.List;
import java.util.UUID;

public record LoginResponseDTO(
        String accessToken,
        String refreshToken,
        String firstName,
        String lastName,
        UUID userId,
        List<String> roles
) {}
