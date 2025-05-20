import { RotationStatus } from "../../enums/rotation-status.enum";
import { CustomDate } from "../../models/rotation.model";

export interface UpdateUserRotationDTO{
   userId: string
   projectId: string | undefined;
   startDate: string; // Expect 'YYYY-MM-DD' 
   endDate: string;   // Expect 'YYYY-MM-DD'
   shift: number;     // Number of weeks 'OnSite' (should be > 0 for cycle logic)
   cycle?: number;     // Total length of the cycle in weeks (should be >= shift)
   customDates?: CustomDate[]|null; 
   updatedDate?:string  
   updatedStatus?:RotationStatus
}