import { CustomDate } from './custom-date.dto';
import { RotationStatus } from './rotation-status.enum';

export interface RcUpdateAssociateRotationDTO {
  userId: string;
  date?: string; // Made optional as the calendar component doesn't always use it
  status?: string; // Made optional as the calendar component doesn't always use it
  customDates?: CustomDate[]; // Used in calendar component to batch update multiple dates
}
