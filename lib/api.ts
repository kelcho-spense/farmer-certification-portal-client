import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// Runtime config cache
let cachedApiUrl: string | null = null;

// Get API URL - uses runtime config in browser, env var on server
const getApiUrl = (): string => {
    // If we have a cached value, use it
    if (cachedApiUrl) return cachedApiUrl;

    // Default fallback
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
};

// Initialize API URL from runtime config (call this on app mount)
export const initializeApiUrl = async (): Promise<void> => {
    if (typeof window !== 'undefined' && !cachedApiUrl) {
        try {
            const response = await fetch('/api/config');
            const config = await response.json();
            cachedApiUrl = config.apiUrl;
            api.defaults.baseURL = cachedApiUrl ?? undefined;
        } catch {
            // Use default if config fetch fails
            cachedApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        }
    }
};

export const api = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add access token to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // If 401 and not already retrying, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${api.defaults.baseURL}/auth/refresh`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${refreshToken}`,
                            },
                        }
                    );

                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    // Store new tokens
                    Cookies.set('accessToken', accessToken, { expires: 1 });
                    Cookies.set('refreshToken', newRefreshToken, { expires: 7 });

                    // Retry original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, clear tokens and redirect to login
                    Cookies.remove('accessToken');
                    Cookies.remove('refreshToken');
                    Cookies.remove('user');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
