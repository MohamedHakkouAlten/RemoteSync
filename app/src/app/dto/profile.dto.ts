/**
 * Data transfer object for the associate profile
 */
export interface ProfileDTO {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  updatedAt?: string; // ISO date string format
}
