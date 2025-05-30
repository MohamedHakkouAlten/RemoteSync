package com.alten.remotesync.application.user.record.response;

public record AssociateProfileDTO(
        String firstName,
        String lastName,
        String email,
        String username,
        String phoneNumber
) {
}
