import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "./auth.service";
import { loginSchema } from "./auth.validation";
import { handleApiError } from "@/src/shared/errors/error-handler";
import { validateBody } from "@/src/shared/validation/validation-helpers";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(request: NextRequest): Promise<NextResponse> {
        try {
            const dto = await validateBody(request, loginSchema);
            const result = await this.authService.login(dto);

            return NextResponse.json({
                success: true,
                ...result,
            });
        } catch (error) {
            return handleApiError(error);
        }
    }

    async logout(request: NextRequest): Promise<NextResponse> {
        try {
            await this.authService.logout();

            return NextResponse.json({
                success: true,
                message: "Logged out successfully",
            });
        } catch (error) {
            return handleApiError(error);
        }
    }

    async me(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await this.authService.getCurrentUser();

            if (!user) {
                return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
            }

            return NextResponse.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    departmentId: user.departmentId,
                },
            });
        } catch (error) {
            return handleApiError(error);
        }
    }
}
