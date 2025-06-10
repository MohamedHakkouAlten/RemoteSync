// Request DTOs
export interface ResetPasswordRequestDto {
    token: string;
    password: string;  // Renamed to match backend DTO field
    confPassword: string;  // Renamed to match backend DTO field
}
