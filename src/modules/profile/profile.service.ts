import { ProfileRepository } from "./profile.repository";
import { UpdateProfileDto, ChangePasswordDto } from "./profile.dto";
import { SessionUser } from "@/src/infrastructure/authentication/session";
import { hashPassword, verifyPassword } from "@/src/infrastructure/authentication/password";
import { NotFoundError, ForbiddenError, ValidationError } from "@/src/shared/errors/AppError";

export class ProfileService {
    private repository: ProfileRepository;

    constructor() {
        this.repository = new ProfileRepository();
    }

    async getProfile(userId: string) {
        const user = await this.repository.findById(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateProfile(userId: string, dto: UpdateProfileDto, currentUser: SessionUser) {
        // Verify user exists
        await this.getProfile(userId);

        // Only allow users to update their own profile
        if (userId !== currentUser.id) {
            throw new ForbiddenError("You can only update your own profile");
        }

        const updateData: any = {};
        if (dto.firstName) updateData.firstName = dto.firstName;
        if (dto.lastName) updateData.lastName = dto.lastName;
        if (dto.email) {
            // Check for duplicate email
            const existing = await this.repository.findByEmail(dto.email);
            if (existing && existing.id !== userId) {
                throw new ValidationError("Email already in use");
            }
            updateData.email = dto.email.toLowerCase();
        }

        const updatedUser = await this.repository.update(userId, updateData);
        const { passwordHash, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    async changePassword(userId: string, dto: ChangePasswordDto, currentUser: SessionUser) {
        // Only allow users to change their own password
        if (userId !== currentUser.id) {
            throw new ForbiddenError("You can only change your own password");
        }

        const user = await this.repository.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Verify current password
        const isValid = await verifyPassword(dto.currentPassword, user.passwordHash);
        if (!isValid) {
            throw new ValidationError("Current password is incorrect");
        }

        // Hash new password
        const newPasswordHash = await hashPassword(dto.newPassword);

        // Update password
        await this.repository.updatePassword(userId, newPasswordHash);

        return { message: "Password changed successfully" };
    }
}
