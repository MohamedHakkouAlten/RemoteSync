package com.alten.remotesync.application.globalDTO;

import java.util.UUID;

public record GlobalDTO(
        UUID userId,
        UUID clientId,
        UUID projectId

) {
    public static GlobalDTO fromUserId(UUID userId) {
        return new GlobalDTO(userId, null, null);
    }

    public static GlobalDTO fromClientId(UUID clientId) {
        return new GlobalDTO(null, clientId, null);
    }

    public static GlobalDTO fromProjectId(UUID projectId) {
        return new GlobalDTO(null, null, projectId);
    }

    public static GlobalDTO fromUserIdAndClientId(UUID userId, UUID clientId) {
        return new GlobalDTO(userId, clientId, null);
    }

    public static GlobalDTO fromUserIdAndProjectId(UUID userId, UUID projectId){
        return new GlobalDTO(userId, null, projectId);
    }
}