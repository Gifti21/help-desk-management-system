import { z } from "zod";

export const createTicketSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().min(1, "Category is required"),
    departmentId: z.string().min(1, "Department is required"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    requesterId: z.string().optional(),
    requesterEmail: z.string().email().optional(),
});

export const updateTicketSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    assigneeId: z.string().nullable().optional(),
    categoryId: z.string().optional(),
    departmentId: z.string().optional(),
});
