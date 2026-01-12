import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, CreateAdminDto } from './dto';
import { User } from '../users/entities';
import { JwtPayload } from './types';
interface RequestWithUser extends Request {
    user: JwtPayload & {
        refreshToken: string;
    };
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        tokens: import("./types").Tokens;
        user: Partial<User>;
    }>;
    login(loginDto: LoginDto): Promise<{
        tokens: import("./types").Tokens;
        user: Partial<User>;
    }>;
    createAdmin(createAdminDto: CreateAdminDto): Promise<{
        tokens: import("./types").Tokens;
        user: Partial<User>;
    }>;
    logout(user: User): Promise<{
        message: string;
    }>;
    refreshTokens(req: RequestWithUser): Promise<import("./types").Tokens>;
}
export {};
