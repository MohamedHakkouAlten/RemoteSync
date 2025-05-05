// Request DTOs
export interface ResetPasswordRequestDto{
    token: string;
    newPassword: string;
    confirmPassword: string;
}