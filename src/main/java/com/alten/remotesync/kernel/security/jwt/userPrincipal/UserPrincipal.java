package com.alten.remotesync.kernel.security.jwt.userPrincipal;

import java.util.UUID;

public record UserPrincipal(UUID userId, String email) {
}
