import { CalendarDay, CalendarEvent } from '../models/dashboard.model';

/**
 * Helper class for calendar operations in the associate dashboard
 */
export class CalendarHelpers {
  /**
   * Generate an array of dates for the current month
   * @param year Year to generate calendar for
   * @param month Month to generate calendar for (0-11)
   * @returns Array of Date objects for the month
   */
  static getDaysInMonth(year: number, month: number): Date[] {
    const result: Date[] = [];
    const date = new Date(year, month, 1);
    
    while (date.getMonth() === month) {
      result.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return result;
  }

  /**
   * Generate padding days before the first day of the month
   * @param year Year to generate calendar for
   * @param month Month to generate calendar for (0-11)
   * @returns Array of numbers representing the dates from the previous month
   */
  static getDaysBeforeMonth(year: number, month: number): number[] {
    const firstDay = new Date(year, month, 1).getDay();
    const result: number[] = [];
    
    if (firstDay > 0) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
      
      for (let i = firstDay - 1; i >= 0; i--) {
        result.push(daysInPrevMonth - i);
      }
    }
    
    return result;
  }

  /**
   * Generate padding days after the last day of the month
   * @param year Year to generate calendar for
   * @param month Month to generate calendar for (0-11)
   * @returns Array of numbers representing the dates from the next month
   */
  static getDaysAfterMonth(year: number, month: number): number[] {
    const lastDay = new Date(year, month + 1, 0);
    const result: number[] = [];
    const daysNeeded = 6 - lastDay.getDay();
    
    for (let i = 1; i <= daysNeeded; i++) {
      result.push(i);
    }
    
    return result;
  }

  /**
   * Format a calendar day object with relevant information
   * @param date Date to format
   * @param currentMonth Current month being displayed
   * @param events Calendar events to check against
   * @returns Formatted CalendarDay object
   */
  static formatCalendarDay(date: Date, currentMonth: number, events: CalendarEvent[]): CalendarDay {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      date: date,
      isCurrentMonth: date.getMonth() === currentMonth,
      hasEvent: events.some(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === date.getDate() && 
               eventDate.getMonth() === date.getMonth() && 
               eventDate.getFullYear() === date.getFullYear();
      }),
      isToday: date.getTime() === today.getTime()
    };
  }

  /**
   * Get month name from month number
   * @param month Month number (0-11)
   * @returns Month name
   */
  static getMonthName(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  }
}
