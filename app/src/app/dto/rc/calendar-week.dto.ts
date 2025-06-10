import { CalendarDay } from "./calendar-day.dto";

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}
