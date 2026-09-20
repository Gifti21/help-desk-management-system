import { NextRequest, NextResponse } from "next/server";
import { ProfileService } from "./profile.service";
import { requireAuth } from "@/src/middleware/auth.middleware";
import { handleApiError } from "@/src/shared/errors/error-handler";
import { successResponse } from "@/src/shared/responses/api-response";
import { validateBody } from "@/src/shared/validation/validation-helpers";
import { updateProfileSchema, changePasswordSchema } from "./profile.validation";

export class ProfileController {
    private service: ProfileService;

    constructor() {
        this.service = new ProfileService();
    }

    async getProfile(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const profile = await this.service.getProfile(user.id);

            return successResponse(profile);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async updateProfile(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const dto = await validateBody(request, updateProfileSchema);
            const profile = await this.service.updateProfile(user.id, dto, user);

            return successResponse(profile);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async changePassword(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const dto = await validateBody(request, changePasswordSchema);
            const result = await this.service.changePassword(user.id, dto, user);

            return successResponse(result);
        } catch (error) {
            return handleApiError(error);
        }
    }
}
