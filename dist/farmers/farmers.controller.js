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
exports.FarmersController = void 0;
const common_1 = require("@nestjs/common");
const farmers_service_1 = require("./farmers.service");
const dto_1 = require("./dto");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
const enums_1 = require("../common/enums");
const entities_1 = require("../users/entities");
let FarmersController = class FarmersController {
    farmersService;
    constructor(farmersService) {
        this.farmersService = farmersService;
    }
    async findAll() {
        return this.farmersService.findAllFarmers();
    }
    async getMyProfile(user) {
        return this.farmersService.getMyProfile(user.id);
    }
    async getFarmerStatus(id, user) {
        if (user.role === enums_1.UserRole.FARMER && user.id !== id) {
            return this.farmersService.getFarmerStatus(user.id);
        }
        return this.farmersService.getFarmerStatus(id);
    }
    async updateFarmerStatus(id, updateFarmerStatusDto) {
        return this.farmersService.updateFarmerStatus(id, updateFarmerStatusDto);
    }
};
exports.FarmersController = FarmersController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FarmersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User]),
    __metadata("design:returntype", Promise)
], FarmersController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, entities_1.User]),
    __metadata("design:returntype", Promise)
], FarmersController.prototype, "getFarmerStatus", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateFarmerStatusDto]),
    __metadata("design:returntype", Promise)
], FarmersController.prototype, "updateFarmerStatus", null);
exports.FarmersController = FarmersController = __decorate([
    (0, common_1.Controller)('farmers'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [farmers_service_1.FarmersService])
], FarmersController);
//# sourceMappingURL=farmers.controller.js.map