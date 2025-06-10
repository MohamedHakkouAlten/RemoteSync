package com.alten.remotesync.application.user.record.request;

import jakarta.validation.constraints.NotNull;

public record RecoverPasswordDTO(
        @NotNull(message = "Email address is required to recover your password.")
        String email
) {
}
