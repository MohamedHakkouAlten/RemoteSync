import { RotationStatus } from './rotation-status.enum';

export interface CustomDate {
  date: string;
  status?: string; // Made optional as the calendar component doesn't use it
  rotationStatus?: RotationStatus; // Used in calendar component
}
