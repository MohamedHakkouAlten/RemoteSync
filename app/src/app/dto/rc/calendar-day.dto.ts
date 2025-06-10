export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  status: 'none' | 'onsite' | 'remote';
  isModified?: boolean;
}
