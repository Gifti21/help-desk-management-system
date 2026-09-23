import { NextRequest, NextResponse } from "next/server";
import { TicketService } from "./ticket.service";
import { requireAuth } from "@/src/middleware/auth.middleware";
import { handleApiError } from "@/src/shared/errors/error-handler";
import {
    successResponse,
    paginatedResponse,
} from "@/src/shared/responses/api-response";
import { validateBody } from "@/src/shared/validation/validation-helpers";
import { createTicketSchema, updateTicketSchema } from "./ticket.validation";
import { parseQueryParams } from "@/src/shared/validation/validation-helpers";
import { withApiTiming } from "@/lib/api-timing";

export class TicketController {
    private service: TicketService;

    constructor() {
        this.service = new TicketService();
    }

    async getAll(request: NextRequest): Promise<NextResponse> {
        const startedAt = performance.now();

        try {
            const user = await requireAuth();
            const { page, pageSize, paginated, filters } = parseQueryParams(
                request.url,
            );

            const { tickets, total } = await this.service.getAllTickets(
                user,
                filters,
                paginated ? page : undefined,
                pageSize,
            );

            const response = paginated
                ? paginatedResponse(tickets, total, page, pageSize!)
                : NextResponse.json(tickets);

            return withApiTiming(response, startedAt, "/api/tickets");
        } catch (error) {
            return handleApiError(error);
        }
    }

    async getById(request: NextRequest, id: string): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const ticket = await this.service.getTicketById(id, user);

            return successResponse(ticket);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async create(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const dto = await validateBody(request, createTicketSchema);
            const ticket = await this.service.createTicket(dto, user);

            return successResponse(ticket, 201);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async update(request: NextRequest, id: string): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const dto = await validateBody(request, updateTicketSchema);
            const ticket = await this.service.updateTicket(id, dto, user);

            return successResponse(ticket);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async delete(request: NextRequest, id: string): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            await this.service.deleteTicket(id, user);

            return successResponse({ message: "Ticket deleted" });
        } catch (error) {
            return handleApiError(error);
        }
    }

    async getTicketsForEmployee(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            if (user.role !== "EMPLOYEE") {
                return NextResponse.json(
                    { error: "Unauthorized - Employee access required" },
                    { status: 401 }
                );
            }

            const { page, pageSize, paginated, filters } = parseQueryParams(request.url);
            const { tickets, total } = await this.service.getEmployeeTickets(
                user.id,
                filters,
                paginated ? page : undefined,
                pageSize
            );

            return paginated
                ? paginatedResponse(tickets, total, page, pageSize!)
                : successResponse(tickets);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async createTicketForEmployee(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            if (user.role !== "EMPLOYEE") {
                return NextResponse.json(
                    { error: "Unauthorized - Employee access required" },
                    { status: 401 }
                );
            }

            const dto = await validateBody(request, createTicketSchema);
            const ticket = await this.service.createEmployeeTicket(dto, user);

            return successResponse(ticket, 201);
        } catch (error) {
            return handleApiError(error);
        }
    }
}
