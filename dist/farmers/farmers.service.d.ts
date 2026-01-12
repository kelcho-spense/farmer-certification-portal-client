import { Repository } from 'typeorm';
import { User } from '../users/entities';
import { UpdateFarmerStatusDto } from './dto';
import { CertificationStatus } from '../common/enums';
type SafeUser = Omit<User, 'password' | 'hashedRefreshToken'>;
export declare class FarmersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    private excludeSensitiveFields;
    findAllFarmers(): Promise<SafeUser[]>;
    findFarmerById(id: string): Promise<User>;
    updateFarmerStatus(id: string, updateFarmerStatusDto: UpdateFarmerStatusDto): Promise<SafeUser>;
    getFarmerStatus(id: string): Promise<{
        status: CertificationStatus;
        name: string;
        farmSize: number;
        cropType: string;
    }>;
    getMyProfile(userId: string): Promise<SafeUser>;
}
export {};
