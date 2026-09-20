import { z } from "zod";

export const createUserSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "agent", "employee"], {
        message: "Role must be admin, agent, or employee",
    }),
    departmentId: z.string().min(1, "Department is required"),
    isActive: z.boolean().optional().default(true),
});

export const updateUserSchema = z.object({
    email: z.string().email("Invalid email address").optional(),
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    role: z.enum(["admin", "agent", "employee"]).optional(),
    departmentId: z.string().optional(),
    isActive: z.boolean().optional(),
});
