export type UserRole = 'farmer' | 'admin';

export type CertificationStatus = 'pending' | 'certified' | 'declined';

export interface User {
    id: string;
    email: string;
    name: string;
    farmSize?: number;
    cropType?: string;
    role: UserRole;
    status: CertificationStatus;
    createdAt: string;
    updatedAt: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    tokens: Tokens;
    user: User;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    farmSize: number;
    cropType: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface UpdateStatusData {
    status: CertificationStatus;
}

export interface FarmerStatus {
    status: CertificationStatus;
    name: string;
    farmSize: number;
    cropType: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
}
