export interface UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
