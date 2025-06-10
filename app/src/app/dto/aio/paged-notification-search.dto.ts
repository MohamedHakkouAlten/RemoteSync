import { NotificationStatus } from '../notification-status.enum';

export interface PagedNotificationSearchDTO {
  pageNumber: number;
  pageSize: number;
  title?: string;
  status?: NotificationStatus;
  createdAt?: string;
}
