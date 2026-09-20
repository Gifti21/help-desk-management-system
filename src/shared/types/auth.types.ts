export type Role = "ADMIN" | "AGENT" | "EMPLOYEE";

export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    departmentId: string;
}
