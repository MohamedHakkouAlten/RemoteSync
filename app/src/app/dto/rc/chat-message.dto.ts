export enum MessageType {
  CHAT = 'CHAT',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE'
}

export interface ChatMessage {
  type: MessageType;
  content: string;
  senderUsername: string;
  senderId: string;
  timestamp: Date;
}
