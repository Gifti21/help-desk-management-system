import { loginUser as sessionLoginUser, logoutUser as sessionLogoutUser, SessionUser, getSessionUser } from "@/src/infrastructure/authentication/session";
import { LoginDto, LoginResponse } from "./auth.types";
import { UnauthorizedError } from "@/src/shared/errors/AppError";

export class AuthService {
    async login(dto: LoginDto): Promise<LoginResponse> {
        const user = await sessionLoginUser(dto.email, dto.password);

        if (!user) {
            throw new UnauthorizedError("Invalid email or password");
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
        };
    }

    async logout(): Promise<void> {
        await sessionLogoutUser();
    }

    async getCurrentUser(): Promise<SessionUser | null> {
        return await getSessionUser();
    }
}
