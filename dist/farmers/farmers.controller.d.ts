import { FarmersService } from './farmers.service';
import { UpdateFarmerStatusDto } from './dto';
import { UserRole } from '../common/enums';
import { User } from '../users/entities';
export declare class FarmersController {
    private readonly farmersService;
    constructor(farmersService: FarmersService);
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        farmSize: number;
        cropType: string;
        role: UserRole;
        status: import("../common/enums").CertificationStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getMyProfile(user: User): Promise<{
        id: string;
        email: string;
        name: string;
        farmSize: number;
        cropType: string;
        role: UserRole;
        status: import("../common/enums").CertificationStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getFarmerStatus(id: string, user: User): Promise<{
        status: import("../common/enums").CertificationStatus;
        name: string;
        farmSize: number;
        cropType: string;
    }>;
    updateFarmerStatus(id: string, updateFarmerStatusDto: UpdateFarmerStatusDto): Promise<{
        id: string;
        email: string;
        name: string;
        farmSize: number;
        cropType: string;
        role: UserRole;
        status: import("../common/enums").CertificationStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
