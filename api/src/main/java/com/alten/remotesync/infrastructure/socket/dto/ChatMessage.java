package com.alten.remotesync.infrastructure.socket.dto;

import lombok.Data;

@Data
public class ChatMessage {
    private String content;
    private String senderName;
    private String senderId;
    private String timestamp;
}
