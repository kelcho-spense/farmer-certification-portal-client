import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities';
import { RegisterDto, LoginDto, CreateAdminDto } from './dto';
import { Tokens } from './types';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private configService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        tokens: Tokens;
        user: Partial<User>;
    }>;
    login(loginDto: LoginDto): Promise<{
        tokens: Tokens;
        user: Partial<User>;
    }>;
    createAdmin(createAdminDto: CreateAdminDto): Promise<{
        tokens: Tokens;
        user: Partial<User>;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<Tokens>;
    validateUser(id: string): Promise<User | null>;
    private excludeSensitiveFields;
    private getOrThrow;
    private hashData;
    private generateTokens;
    private updateRefreshToken;
}
