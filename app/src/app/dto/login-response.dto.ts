/**
 * Data Transfer Object for Login Response
 * This interface defines the shape of data received from the login API
 */

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  firstName: string;
  lastName: string;
  roles: string[];
}