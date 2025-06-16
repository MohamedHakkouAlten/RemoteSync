import { NotificationStatus } from "../dto/notification-status.enum";
import { NotificationType } from "../enums/notification-type.enum";
import { User } from "./user.model";

export interface Notification {
  id: string;
  type: 'report' | 'rotation' | 'general';
  title: string;
  senderInitial: string;
  senderName: string;
  timestamp: string;
  message: string;
  isRead: boolean;
  status: NotificationStatus;
  statusClass: string;
  }