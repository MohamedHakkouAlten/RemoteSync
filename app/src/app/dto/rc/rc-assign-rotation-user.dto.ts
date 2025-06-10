import { RcAssociateDTO } from './rc-associate.dto';
import { CustomDate } from './custom-date.dto';
import { ListItem } from './list-item.dto';

// Type to represent either a ListItem or RcAssociateDTO
type AssociateItem = ListItem | RcAssociateDTO;

/**
 * Interface for rotation assignment matching backend DTO:
 * 
 * public record RcAssignRotationUserDTO(
 *     List<UUID> associates,
 *     List<CustomDate> customDates,
 *     String projectId,
 *     String startDate,
 *     String endDate,
 *     Integer remoteWeeksPerCycle,
 *     Integer cycleLengthWeeks
 * )
 */
export interface RcAssignRotationUser {
  // Legacy fields used in the frontend (not sent to backend)
  userId: string;
  dates: string[];
  
  // Fields that match the backend DTO
  associates: string[] | AssociateItem[]; // Can be either array of IDs or full objects
  projectId?: string;
  startDate?: string;
  endDate?: string;
  remoteWeeksPerCycle?: number;
  cycleLengthWeeks?: number;
  customDates?: CustomDate[];
}
