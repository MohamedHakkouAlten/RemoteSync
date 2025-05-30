/**
 * Calendar component models
 * Contains interfaces for calendar data structures
 */

/**
 * Calendar event representing a rotation or other scheduled event
 */
export interface CalendarEvent {
  id: string;
  type?: 'Remote' | 'In Site';
  color?: 'blue' | 'orange';
  description?: string;
  note?: string;
  date: Date;
}

/**
 * Day data for calendar display
 */
export interface DayData {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  weekIndicator?: 'blue' | 'orange';
}

/**
 * Week data for calendar display
 */
export interface WeekData {
  days: DayData[];
}

/**
 * Month summary for year view
 */
export interface MonthSummary {
  monthName: string;
  monthIndex: number;
  year: number;
  inSitePercent: number;
  remotePercent: number;
  isCurrentMonth: boolean;
}

/**
 * Calendar view types
 */
export type CalendarView = 'week' | 'month' | 'year';

/**
 * Calendar filter options
 */
export interface CalendarFilter {
  showRemote: boolean;
  showInSite: boolean;
}
