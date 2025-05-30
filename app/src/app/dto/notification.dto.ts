import { NotificationStatus } from '../dto/notification-status.enum';

export interface NotificationDTO {
  notificationId: string;
  title: string;
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
