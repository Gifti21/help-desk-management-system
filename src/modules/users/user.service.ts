import { UserRepository } from "./user.repository";
import { CreateUserDto, UpdateUserDto, UserFilters } from "./user.dto";
import { hashPassword } from "@/src/infrastructure/authentication/password";
import { ConflictError, NotFoundError } from "@/src/shared/errors/AppError";
import { prisma } from "@/src/infrastructure/database/prisma";

export class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    async getAllUsers(filters?: UserFilters) {
        const users = await this.repository.findAll(filters);

        // Remove password hash from response
        return users.map(({ passwordHash, ...userRest }) => userRest);
    }

    async getUserById(id: string) {
        const user = await this.repository.findById(id);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async createUser(dto: CreateUserDto) {
        // Check if department exists
        const department = await prisma.department.findUnique({
            where: { id: dto.departmentId },
        });

        if (!department) {
            throw new NotFoundError("Department not found");
        }

        // Check for duplicate email
        const existingUser = await this.repository.findByEmail(dto.email);

        if (existingUser) {
            throw new ConflictError("User with this email already exists");
        }

        // Hash password
        const passwordHash = await hashPassword(dto.password);

        // Create user
        const newUser = await this.repository.create({
            email: dto.email.toLowerCase(),
            firstName: dto.firstName,
            lastName: dto.lastName,
            passwordHash,
            role: dto.role.toUpperCase() as "ADMIN" | "AGENT" | "EMPLOYEE",
            department: { connect: { id: dto.departmentId } },
            isActive: dto.isActive ?? true,
        });

        const { passwordHash: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        // Verify user exists
        await this.getUserById(id);

        // Check for duplicate email if email is being updated
        if (dto.email) {
            const existing = await this.repository.findByEmail(dto.email);
            if (existing && existing.id !== id) {
                throw new ConflictError("User with this email already exists");
            }
        }

        // Check if department exists if being updated
        if (dto.departmentId) {
            const department = await prisma.department.findUnique({
                where: { id: dto.departmentId },
            });
            if (!department) {
                throw new NotFoundError("Department not found");
            }
        }

        const updateData: any = {};
        if (dto.email) updateData.email = dto.email.toLowerCase();
        if (dto.firstName) updateData.firstName = dto.firstName;
        if (dto.lastName) updateData.lastName = dto.lastName;
        if (dto.role) updateData.role = dto.role.toUpperCase();
        if (dto.departmentId) updateData.department = { connect: { id: dto.departmentId } };
        if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

        const updatedUser = await this.repository.update(id, updateData);
        const { passwordHash, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    async deleteUser(id: string) {
        await this.getUserById(id);
        return await this.repository.delete(id);
    }
}
