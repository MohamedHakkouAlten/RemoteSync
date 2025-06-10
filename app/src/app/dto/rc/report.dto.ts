export interface ReportDTO {
  // Define properties as used in dashboard/report components
  id: string;
  title: string;
  status: string;
  reason: string;
  createdAt: string;
  createdBy: {
    firstName: string;
    lastName: string;
    // Add other user properties as needed
  };
  // Add more fields as needed
}
