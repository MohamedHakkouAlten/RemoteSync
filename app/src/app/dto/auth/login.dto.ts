// Request DTOs
export interface LoginRequestDto {
    usernameOrEmail: string;
    password: string;
}

// Response DTOs
export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  firstName: string;
  lastName: string;
  roles: string[];
}