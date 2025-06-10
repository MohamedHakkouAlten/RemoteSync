export interface RcRecentAssociateRotations {
  userId: string;
  fullName: string; // Added for use in calendar.component.html
  rotationId: string; // Added for use in dashboard component
  onSiteDates: string[];
  remoteDates: string[];
  // Add other relevant fields as needed
}
