package com.alten.remotesync.application.user.record.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LoginRequestDTO(
        @NotBlank(message = "Username Or Email cannot be blank")
        @Size(min = 3, max = 50, message = "Username Or Email must be between 3 and 50 characters")
        String usernameOrEmail,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
        String password
) {
}
