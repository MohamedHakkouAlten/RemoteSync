package com.alten.remotesync.application.user.record.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;

import java.util.UUID;

public record UserDTO(
        UUID userId,
        String firstName,
        String lastName,
        String email,
        String password,
        String username,
        Long reference,
        String phoneNumber
) {
}
