import { RcRecentAssociateRotations } from './rc-recent-associate-rotations.dto';

export interface RcRotationsResponse {
  rcAllRecentAssociateRotations: RcRecentAssociateRotations[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}
