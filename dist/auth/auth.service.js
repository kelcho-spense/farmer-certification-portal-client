"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const entities_1 = require("../users/entities");
const enums_1 = require("../common/enums");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    configService;
    constructor(userRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const { email, password, name, farmSize, cropType } = registerDto;
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await this.hashData(password);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            name,
            farmSize,
            cropType,
            role: enums_1.UserRole.FARMER,
        });
        await this.userRepository.save(user);
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return { tokens, user: this.excludeSensitiveFields(user) };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return { tokens, user: this.excludeSensitiveFields(user) };
    }
    async createAdmin(createAdminDto) {
        const { email, password, name } = createAdminDto;
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await this.hashData(password);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            name,
            role: enums_1.UserRole.ADMIN,
        });
        await this.userRepository.save(user);
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return { tokens, user: this.excludeSensitiveFields(user) };
    }
    async logout(userId) {
        await this.userRepository.update(userId, { hashedRefreshToken: null });
        return { message: 'Logged out successfully' };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.hashedRefreshToken) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async validateUser(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    excludeSensitiveFields(user) {
        const { password, hashedRefreshToken, ...safeUser } = user;
        void password;
        void hashedRefreshToken;
        return safeUser;
    }
    getOrThrow(key) {
        const value = this.configService.get(key);
        if (value === undefined || value === null) {
            throw new Error(`${key} is not defined in environment variables`);
        }
        return value;
    }
    async hashData(data) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(data, salt);
    }
    async generateTokens(userId, email, role) {
        const payload = {
            sub: userId,
            email,
            role,
        };
        const accessExpiresIn = parseInt(this.configService.get('JWT_ACCESS_EXPIRES_IN_SECONDS') ?? '900', 10);
        const refreshExpiresIn = parseInt(this.configService.get('JWT_REFRESH_EXPIRES_IN_SECONDS') ??
            '604800', 10);
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.getOrThrow('JWT_ACCESS_SECRET'),
                expiresIn: accessExpiresIn,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.getOrThrow('JWT_REFRESH_SECRET'),
                expiresIn: refreshExpiresIn,
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.userRepository.update(userId, { hashedRefreshToken });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map