import { NotificationType } from "../enums/notification-type.enum";
import { User } from "./user.model";

export interface Notification {
    id: number;
    type: NotificationType;
    sender:User;
    timestamp: Date;
    message: string;
    isRead: boolean;
  }