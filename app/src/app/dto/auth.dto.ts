/**
 * Data Transfer Objects for Authentication
 * These interfaces define the shape of data exchanged with the authentication API
 */

// Request DTOs
export interface LoginRequestDto {
    usernameOrEmail: string;
    password: string;
}

// Response DTOs
export interface AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: UserDto;
}

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}