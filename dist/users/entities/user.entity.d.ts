import { UserRole, CertificationStatus } from '../../common/enums';
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    farmSize: number;
    cropType: string;
    role: UserRole;
    status: CertificationStatus;
    hashedRefreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
}
