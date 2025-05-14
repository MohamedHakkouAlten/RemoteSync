import { Injectable } from "@angular/core";
import { RotationStatus } from "../enums/rotation-status.enum";
import { addWeeks, differenceInCalendarWeeks, differenceInWeeks, isAfter, isBefore, isEqual, isValid, parseISO, startOfWeek } from "date-fns";
import { CustomDate, Peroid, Rotation, UserRotation } from "../models/rotation.model";
import { User } from "../models/user.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";
import { PagedData, ResponseWrapperDto } from "../dto/response-wrapper.dto";
import { environment } from "../../environments/environment";
import { RotationOutput } from "../components/rc/rotation/rotation.component";
import { UpdateUserRotationDTO } from "../dto/rotation/updateUserRotationDTO";






// --- Helper Function for Date Parsing ---
function parseAndValidate(dateString: string | undefined | null): Date | null {
  if (!dateString) return null;
  const date = parseISO(dateString); // Handles 'YYYY-MM-DD'
  return isValid(date) ? date : null;
}


@Injectable()
export class RotationService {

private readonly rcApiUrl=environment.apiUrl+'/user/rc/rotations'
constructor(private http:HttpClient){

}

addUsersRotation(rotation:RotationOutput):Observable<boolean>{
   const url = this.rcApiUrl+'/createRotation';
   return this.http.post<ResponseWrapperDto<any>>(url,rotation).pipe(
    map((response)=>{
     return (response.status='success') ? true:false
    })
   )
}
updateUsersRotation(rotation:UpdateUserRotationDTO):Observable<boolean>{
   const url = this.rcApiUrl+'/updateRotation';
   return this.http.put<ResponseWrapperDto<any>>(url,rotation).pipe(
    map((response)=>{
     return (response.status='success') ? true:false
    })
   )
}
getActiveUsersRotationByName(pageNumber: number, pageSize: number,name:string): Observable<PagedData<UserRotation[]>> {
  const url = this.rcApiUrl+'/byName';
  console.log(name)
  const params = new HttpParams()
    .set('name', name)
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize);

  return this.http.get<ResponseWrapperDto<PagedData<UserRotation[]>>>(url, { params }).pipe(
    map(response => {
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch active user rotations');
    }),
    catchError(error => {
      console.error('Error in getActiveUsersRotation:', error);
      return of({ items: [], totalItems: 0 } as unknown as PagedData<UserRotation[]>); // fallback
    })
  );

}
getActiveUsersRotationByProject(pageNumber: number, pageSize: number,projectId:string): Observable<PagedData<UserRotation[]>> {
  const url = this.rcApiUrl+'/byProject';
  const params = new HttpParams()
    .set('projectId', projectId)
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize);

  return this.http.get<ResponseWrapperDto<PagedData<UserRotation[]>>>(url, { params }).pipe(
    map(response => {
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch active user rotations');
    }),
    catchError(error => {
      console.error('Error in getActiveUsersRotation:', error);
      return of({ items: [], totalItems: 0 } as unknown as PagedData<UserRotation[]>); // fallback
    })
  );
}

getActiveUsersRotationByClient(pageNumber: number, pageSize: number,clientId:string): Observable<PagedData<UserRotation[]>> {
  const url = this.rcApiUrl+'/byClient';

  const params = new HttpParams()
    .set('clientId', clientId)
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize);

  return this.http.get<ResponseWrapperDto<PagedData<UserRotation[]>>>(url, { params }).pipe(
    map(response => {
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch active user rotations');
    }),
    catchError(error => {
      console.error('Error in getActiveUsersRotation:', error);
      return of({ items: [], totalItems: 0 } as unknown as PagedData<UserRotation[]>);
    })
  );
}
getActiveUsersRotationByFactory(pageNumber: number, pageSize: number,factoryId:string): Observable<PagedData<UserRotation[]>> {
  const url = this.rcApiUrl+'/byFactory';

  const params = new HttpParams()
    .set('factoryId',factoryId)
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize);

  return this.http.get<ResponseWrapperDto<PagedData<UserRotation[]>>>(url, { params }).pipe(
    map(response => {
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch active user rotations');
    }),
    catchError(error => {
      console.error('Error in getActiveUsersRotation:', error);
      return of({ items: [], totalItems: 0 } as unknown as PagedData<UserRotation[]>);
    })
  );
}
getActiveUsersRotationBySubFactory(pageNumber: number, pageSize: number,subFactoryId:string): Observable<PagedData<UserRotation[]>> {
  const url = this.rcApiUrl+'/bySubFactory';

  const params = new HttpParams()
    .set('subFactoryId',subFactoryId)
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize);

  return this.http.get<ResponseWrapperDto<PagedData<UserRotation[]>>>(url, { params }).pipe(
    map(response => {
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch active user rotations');
    }),
    catchError(error => {
      console.error('Error in getActiveUsersRotation:', error);
      return of({ items: [], totalItems: 0 } as unknown as PagedData<UserRotation[]>);
    })
  );
}
getActiveUsersRotation(pageNumber: number, pageSize: number): Observable<PagedData<UserRotation[]>> {
  const url = this.rcApiUrl;
  const params = new HttpParams()
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize);

  return this.http.get<ResponseWrapperDto<PagedData<UserRotation[]>>>(url, { params }).pipe(
    map(response => {
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch active user rotations');
    }),
    catchError(error => {
      console.error('Error in getActiveUsersRotation:', error);
      return of({ items: [], totalItems: 0 } as unknown as PagedData<UserRotation[]>); // fallback
    })
  );
}
  getActiveRotationsByPeroid(period: Peroid, allRotations: Rotation[]): Rotation[] {
      return [];
  }

   getUsersRotations(): UserRotation[] {
    // Check if transformedUsers has data

    const transformedUsers: User[] = [
        { userId: '1', firstName: 'Sarah   ', lastName: ' Wilson' },
        { userId: '2', firstName: 'Michael ', lastName: ' Chen' },
        { userId: '3', firstName: 'Emily   ', lastName: ' Davis' },
        { userId: '4', firstName: 'David   ', lastName: ' Kim' },
        { userId: '5', firstName: 'Lisa    ', lastName: ' Thompson' },
        { userId: '6', firstName: 'Chris   ', lastName: ' Evans' }, // Example different names
        { userId: '7', firstName: 'Anna    ', lastName: ' Lee' },
        { userId: '8', firstName: 'Ben     ', lastName: ' Carter' },
        { userId: '9', firstName: 'Olivia  ', lastName: ' Martinez' },
        { userId: '10', firstName: 'James  ', lastName: ' Rodriguez' },
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
      if (user.userId === '3') { // Emily Davis example overrides
        customDates = [
          { date: '2025-04-14', rotationStatus: RotationStatus.Off }, // Tax day off!
        ];
      } else if (user.userId === '8') { // Ben Carter different overrides
        customDates = [
          { date: '2025-07-07', rotationStatus: RotationStatus.Remote }
        ];
      }

      // Construct the Rotation object using the current user
      const rotation: UserRotation = {
        user: user, // <-- Use the user object directly from transformedUsers
        rotation:{startDate: startDate,
        endDate: endDate,
        shift: shift,
        cycle: cycle,
        customDates: customDates
        }
      };

      return rotation;
    })
   



   
  }

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

        rotation.customDates[existingDateIndex].rotationStatus = newStatus;
    } else {
        // Date NOT FOUND: Add a new entry to the customDates array

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
