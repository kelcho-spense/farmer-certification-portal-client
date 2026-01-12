"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../users/entities");
const enums_1 = require("../common/enums");
let FarmersService = class FarmersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    excludeSensitiveFields(user) {
        const { password, hashedRefreshToken, ...safeUser } = user;
        void password;
        void hashedRefreshToken;
        return safeUser;
    }
    async findAllFarmers() {
        const farmers = await this.userRepository.find({
            where: { role: enums_1.UserRole.FARMER },
            order: { createdAt: 'DESC' },
        });
        return farmers.map((farmer) => this.excludeSensitiveFields(farmer));
    }
    async findFarmerById(id) {
        const farmer = await this.userRepository.findOne({
            where: { id, role: enums_1.UserRole.FARMER },
        });
        if (!farmer) {
            throw new common_1.NotFoundException(`Farmer with ID ${id} not found`);
        }
        return farmer;
    }
    async updateFarmerStatus(id, updateFarmerStatusDto) {
        const farmer = await this.findFarmerById(id);
        farmer.status = updateFarmerStatusDto.status;
        await this.userRepository.save(farmer);
        return this.excludeSensitiveFields(farmer);
    }
    async getFarmerStatus(id) {
        const farmer = await this.findFarmerById(id);
        return {
            status: farmer.status,
            name: farmer.name,
            farmSize: farmer.farmSize,
            cropType: farmer.cropType,
        };
    }
    async getMyProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.excludeSensitiveFields(user);
    }
};
exports.FarmersService = FarmersService;
exports.FarmersService = FarmersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FarmersService);
//# sourceMappingURL=farmers.service.js.map