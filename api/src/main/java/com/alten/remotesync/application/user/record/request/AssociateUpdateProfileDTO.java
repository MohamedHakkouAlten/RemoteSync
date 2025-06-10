package com.alten.remotesync.application.user.record.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record AssociateUpdateProfileDTO(
        @NotBlank(message = "First name cannot be blank")
        @NotNull
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        @NotNull
        String lastName,

        @NotBlank(message = "Phone number cannot be blank")
        @Pattern(
                regexp = "^\\+\\d{1,3} \\d{6,15}$",
                message = "Invalid phone number format. Expected format: +CODE PHONE_NUMBER (e.g., +212 669242712)"
        )
        @NotNull
        String phoneNumber
) {
}
