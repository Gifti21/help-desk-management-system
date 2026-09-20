export interface CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: "admin" | "agent" | "employee";
    departmentId: string;
    isActive?: boolean;
}

export interface UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: "admin" | "agent" | "employee";
    departmentId?: string;
    isActive?: boolean;
}

export interface UserFilters {
    role?: string | null;
    departmentId?: string | null;
    isActive?: boolean | null;
}
