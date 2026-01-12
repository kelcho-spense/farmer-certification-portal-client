import api from './api';
import {
    AuthResponse,
    RegisterData,
    LoginData,
    User,
    UpdateStatusData,
    FarmerStatus,
} from '@/types';

// Auth Services
export const authService = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },

    refresh: async (): Promise<{ accessToken: string; refreshToken: string }> => {
        const response = await api.post('/auth/refresh');
        return response.data;
    },
};

// Farmer Services
export const farmerService = {
    getMyProfile: async (): Promise<User> => {
        const response = await api.get<User>('/farmers/me');
        return response.data;
    },

    getMyStatus: async (id: string): Promise<FarmerStatus> => {
        const response = await api.get<FarmerStatus>(`/farmers/${id}/status`);
        return response.data;
    },

    getAllFarmers: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/farmers');
        return response.data;
    },

    updateFarmerStatus: async (
        id: string,
        data: UpdateStatusData
    ): Promise<User> => {
        const response = await api.patch<User>(`/farmers/${id}/status`, data);
        return response.data;
    },
};
