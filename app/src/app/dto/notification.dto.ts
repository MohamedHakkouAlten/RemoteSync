import { NotificationStatus } from '../dto/notification-status.enum';

export interface NotificationDTO {
  notificationId: string;
  title: string;
  isRead :boolean,
  description: string;
  status: NotificationStatus;
  createdAt: string;
}

export interface PagedNotificationDTO {
  notificationDTOs: NotificationDTO[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}
export interface InitialNotificationDTO {
  notifications: PagedNotificationDTO;
  urgentCount: number,
  importantCount: number,
  normalCount: number
}
export interface PanelNotificationDTO {
  notifications: PagedNotificationDTO;
  countUnreadNotifications :number
}