import { ClientDropDownDTO } from './client-dropdown.dto';
import { FactoryDropDownDTO } from './factory-dropdown.dto';
import { RcRecentAssociateRotations } from './rc-recent-associate-rotations.dto';

export interface RcInitialCalendarResponse {
  clientDropDown: ClientDropDownDTO[];
  factoryDropDown: FactoryDropDownDTO[];
  allRecentAssociateRotations: RcRecentAssociateRotations[];
}
