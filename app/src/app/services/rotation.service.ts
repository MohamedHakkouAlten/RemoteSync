import { Injectable } from "@angular/core";
import { RotationStatus } from "../enums/rotation-status.enum";
import { addWeeks, differenceInCalendarWeeks, differenceInWeeks, isAfter, isBefore, isEqual, isValid, parseISO, startOfWeek } from "date-fns";
import { CustomDate, Peroid, Rotation } from "../models/rotation.model";
import { User } from "../models/user.model";






// --- Helper Function for Date Parsing ---
function parseAndValidate(dateString: string | undefined | null): Date | null {
  if (!dateString) return null;
  const date = parseISO(dateString); // Handles 'YYYY-MM-DD'
  return isValid(date) ? date : null;
}


@Injectable()
export class RotationService {

  // Assuming you fetch/manage the list of all rotations elsewhere
  // For demonstration, it's passed as an argument below.

  /**
   * Filters a list of rotations to find those active within a given period.
   * "Active" means the rotation's date range overlaps with the period's date range.
   *
   * @param period - The period with start_date and end_date strings.
   * @param allRotations - An array of all Rotation objects to filter.
   * @returns An array of active rotations, or an empty array if none are found or inputs are invalid.
   */
  getActiveRotationsByPeroid(period: Peroid, allRotations: Rotation[]): Rotation[] {
      return [];
  }

   getUsersRotations(): Rotation[] {
    // Check if transformedUsers has data

    const transformedUsers: User[] = [
        { id_user: 1, firstName: 'Sarah   ', lastName: ' Wilson' },
        { id_user: 2, firstName: 'Michael ', lastName: ' Chen' },
        { id_user: 3, firstName: 'Emily   ', lastName: ' Davis' },
        { id_user: 4, firstName: 'David   ', lastName: ' Kim' },
        { id_user: 5, firstName: 'Lisa    ', lastName: ' Thompson' },
        { id_user: 6, firstName: 'Chris   ', lastName: ' Evans' }, // Example different names
        { id_user: 7, firstName: 'Anna    ', lastName: ' Lee' },
        { id_user: 8, firstName: 'Ben     ', lastName: ' Carter' },
        { id_user: 9, firstName: 'Olivia  ', lastName: ' Martinez' },
        { id_user: 10, firstName: 'James  ', lastName: ' Rodriguez' },
      ];
    return transformedUsers.map((user, index) => {
      // For each user in the transformed list, create a Rotation object

      // Generate EXAMPLE rotation details (customize these as needed)
      const month = (`0${Math.floor(index / 3) + 1}`).slice(-2); // Example month 01-04
      const day = (`0${(index % 9) + 1}`).slice(-2); // Example day 01-09
      const startDate = `2025-${month}-${day}`; // Example: Vary start dates
      const endDate = '2025-12-31'; // Example: Fixed end date
      const shift = (index % 3) + 1; // Example: Cycle shift 1, 2, 3
      const cycle = shift + 1 + (index % 2); // Example: Slightly varying cycle
      let customDates: CustomDate[] = [];

      // Add some example custom dates based on user ID (or index)
      if (user.id_user === 3) { // Emily Davis example overrides
        customDates = [
          { date: '2025-04-14', rotationStatus: RotationStatus.Off }, // Tax day off!
        ];
      } else if (user.id_user === 8) { // Ben Carter different overrides
        customDates = [
          { date: '2025-07-07', rotationStatus: RotationStatus.Remote }
        ];
      }

      // Construct the Rotation object using the current user
      const rotation: Rotation = {
        user: user, // <-- Use the user object directly from transformedUsers
        startDate: startDate,
        endDate: endDate,
        shift: shift,
        cycle: cycle,
        customDates: customDates
      };

      return rotation;
    })
   



   
  }
  /**
   * Determines the status (OnSite, Remote, Off) of a rotation for a specific date.
   * Checks custom dates first, then calculates based on shift/cycle if applicable.
   *
   * @param rotation - The Rotation object.
   * @param dateString - The target date string ('YYYY-MM-DD').
   * @param options - Optional date-fns options like { weekStartsOn: 1 } for Monday.
   * @returns The RotationStatus for the given date.
   */
  getDateRotationStatus(
      rotation: Rotation,
      dateString: string,
      options?: { weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 }
  ): RotationStatus {

      if (!rotation || !dateString) {
          return RotationStatus.Off; // Cannot determine status without rotation or date
      }
      
     
      // --- 1. Check Custom Dates ---
      // Directly compare date strings assuming consistent 'YYYY-MM-DD' format.
      if (rotation.customDates && rotation.customDates.length > 0) {

          // Use find for cleaner access
          const customMatch = rotation.customDates.find(cd => cd.date === dateString);
          if (customMatch) {
              return customMatch.rotationStatus; // Return status from custom date
          }
      }

      // --- 2. Check Shift/Cycle Logic ---

      // Validate necessary rotation properties for calculation
      if (typeof rotation.shift !== 'number' || rotation.shift <= 0 ||
          typeof rotation.cycle !== 'number' || rotation.cycle < rotation.shift) {
          // If no valid shift/cycle, and not a custom date, it's considered Off
          // unless specific business logic dictates otherwise (e.g., always Remote if no cycle)
          // console.warn("Rotation lacks valid shift/cycle for calculation:", rotation);
          return RotationStatus.Off;
      }

      // Parse all relevant dates
      const targetDate = parseAndValidate(dateString);
      const rotationStartDate = parseAndValidate(rotation.startDate);
      const rotationEndDate = parseAndValidate(rotation.endDate);

      // If any date is invalid, cannot proceed with week calculations
      if (!targetDate || !rotationStartDate || !rotationEndDate) {
          // console.warn("Invalid date string provided for status check:", { dateString, rotation });
          return RotationStatus.Off;
      }

      // Define week options (default Sunday start if not provided)
      const weekOptions = { weekStartsOn: options?.weekStartsOn ?? 0 };

      // Get the start of the week for each date *after* validation
      const targetWeekStart = startOfWeek(targetDate, weekOptions);
      const rotationStartWeek = startOfWeek(rotationStartDate, weekOptions);
      const rotationEndWeek = startOfWeek(rotationEndDate, weekOptions);

      
      // --- Boundary Checks ---
      // Check if the target date is outside the rotation's entire valid week range
      if (isBefore(targetWeekStart, rotationStartWeek) || isAfter(targetWeekStart, rotationEndWeek)) {
          return RotationStatus.Off;
      }

      // --- Calculate Status based on Cycle ---
      // Calculate the number of full weeks between the rotation start week and the target week
      const totalWeeksOffset = differenceInWeeks(targetWeekStart, rotationStartWeek);

      // Find the position within the cycle (0-based index)
      const weekIndexInCycle = totalWeeksOffset % rotation.cycle;
      // Example: cycle=5, offset=0 => 0%5=0; offset=4 => 4%5=4; offset=5 => 5%5=0; offset=7 => 7%5=2

      // Check if the index falls within the 'OnSite' part of the cycle
      if (weekIndexInCycle < rotation.shift) {
           // Weeks 0 to shift-1 are OnSite
          return RotationStatus.OnSite;
      } else {
           // Weeks shift to cycle-1 are Remote
          return RotationStatus.Remote;
      }

      // Note: The final 'return RotationStatus.Off' from the original code
      // becomes redundant because all paths within the shift/cycle logic
      // should lead to OnSite, Remote, or Off (due to boundary/validation checks).
      // If it gets here unexpectedly, Off is a safe default.
      // return RotationStatus.Off; // Should ideally be unreachable if logic above is sound
  }


   updateRotationStatusForDate(
    rotation: Rotation | null | undefined, // Allow null/undefined input
    dateString: string | null | undefined, // Allow null/undefined/empty input
    newStatus: RotationStatus
): Rotation | null | undefined { // Return type matches input possibilities

    // --- 1. Input Validation ---
    if (!rotation || !dateString) {
        console.warn("updateRotationStatusForDate: Invalid input provided.", { rotation, dateString, newStatus });
        return rotation; // Return original object/null/undefined if invalid input
    }

    // --- 2. Ensure customDates Array Exists ---
    // If rotation.customDates is null or undefined, initialize it as an empty array.
    if (!rotation.customDates) {
        rotation.customDates = [];
    }

    // --- 3. Find Existing Custom Date ---
    // Find the index of the custom date entry matching the dateString.
    const existingDateIndex = rotation.customDates.findIndex(cd => cd.date === dateString);

    // --- 4. Update or Add Custom Date ---
    if (existingDateIndex > -1) {
        // Date FOUND: Update the status of the existing entry
        console.log(`Updating existing custom date ${dateString} for user ${rotation.user?.id_user} to ${newStatus}`);
        rotation.customDates[existingDateIndex].rotationStatus = newStatus;
    } else {
        // Date NOT FOUND: Add a new entry to the customDates array
        console.log(`Adding new custom date ${dateString} with status ${newStatus} for user ${rotation.user?.id_user}`);
        const newCustomDate: CustomDate = {
            date: dateString,
            rotationStatus: newStatus
        };
        rotation.customDates.push(newCustomDate);
    }

    // --- 5. Return Updated Rotation ---
    // The input 'rotation' object has been modified directly (mutated).
    return rotation;
}
}
