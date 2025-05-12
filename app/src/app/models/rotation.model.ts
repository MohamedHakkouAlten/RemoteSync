import { RotationStatus } from "../enums/rotation-status.enum";
import { User } from "./user.model";

export interface Peroid { // Consider renaming to Period (typo)
    start_date: string; // Recommend switching to camelCase: startDate
    end_date: string;   // Recommend switching to camelCase: endDate
  }
  
 export interface CustomDate {
    date: string; // Expect 'YYYY-MM-DD'
    rotationStatus: RotationStatus;
  }
  
  export interface UserRotation{
 user:User;
 rotation:Rotation

  }
  
  //TODO : Remove T from backend date
  export interface Rotation {
    rotationId?:string
    startDate: string; // Expect 'YYYY-MM-DD' 
    endDate: string;   // Expect 'YYYY-MM-DD'
    shift: number;     // Number of weeks 'OnSite' (should be > 0 for cycle logic)
    cycle?: number;     // Total length of the cycle in weeks (should be >= shift)
    customDates?: CustomDate[]; // Make optional if not always present
  }
  