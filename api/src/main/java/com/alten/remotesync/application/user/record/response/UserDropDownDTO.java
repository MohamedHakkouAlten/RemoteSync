package com.alten.remotesync.application.user.record.response;

import java.util.UUID;

public record UserDropDownDTO(
       UUID userId,
       String name
) {
}
