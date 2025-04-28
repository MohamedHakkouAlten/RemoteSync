package com.alten.remotesync.application.globalDTO;

import java.util.UUID;

public record GlobalDTO(
        UUID userId,
        UUID clientId,
        UUID projectId,
        UUID factoryId

) {
    public static GlobalDTO fromUserId(UUID userId) {
        return new GlobalDTO(userId, null, null, null);
    }

    public static GlobalDTO fromClientId(UUID clientId) {
        return new GlobalDTO(null, clientId, null, null);
    }

    public static GlobalDTO fromProjectId(UUID projectId) {
        return new GlobalDTO(null, null, projectId, null);
    }

    public static GlobalDTO fromUserIdAndClientId(UUID userId, UUID clientId) {
        return new GlobalDTO(userId, clientId, null, null);
    }

    public static GlobalDTO fromUserIdAndProjectId(UUID userId, UUID projectId){
        return new GlobalDTO(userId, null, projectId, null);
    }

    public static GlobalDTO fromFactoryId(UUID factoryId) {
        return new GlobalDTO(null, null, null, factoryId);
    }
}