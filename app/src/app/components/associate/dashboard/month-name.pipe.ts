// src/app/dashboard/month-name.pipe.ts (adjust path if needed)

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone:false,
  name: 'monthName' // This name must match the one used in the template (| monthName)
  // standalone: true // Optional: Can be standalone in newer Angular versions
})
export class MonthNamePipe implements PipeTransform {

  // Array mapping month index (0-11) to month name
  private monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  /**
   * Transforms a month index (0-11) into its full name.
   * @param monthIndex The month index (0-11), or null/undefined.
   * @returns The full month name string, or an empty string if input is invalid.
   */
  transform(monthIndex: number | null | undefined): string {
    // Check for valid input number within the expected range
    if (monthIndex !== null && monthIndex !== undefined && monthIndex >= 0 && monthIndex <= 11) {
      // Return the name from the array using the index
      return this.monthNames[monthIndex];
    }
    // Return empty string if the input is invalid or null/undefined
    return '';
  }
}