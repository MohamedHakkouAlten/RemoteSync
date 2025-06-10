package com.alten.remotesync.application.user.record.request;

import jakarta.validation.constraints.NotNull;

public record ResetPasswordDTO(
        @NotNull(message = "Password is required to reset your password.")
        String password,
        @NotNull(message = "Confirm password is required to reset your password.")
        String confPassword
) {
}
