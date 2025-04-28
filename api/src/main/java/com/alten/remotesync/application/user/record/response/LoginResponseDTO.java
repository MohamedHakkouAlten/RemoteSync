package com.alten.remotesync.application.user.record.response;

import java.util.List;

public record LoginResponseDTO(
        String accessToken,
        String refreshToken,
        String firstName,
        String lastName,
        List<String> roles
) {}
