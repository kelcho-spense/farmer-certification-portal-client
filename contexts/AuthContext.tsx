'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, LoginData, RegisterData, AuthResponse } from '@/types';
import { authService } from '@/lib/services';
import { initializeApiUrl } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Initialize API URL and load user from cookies on mount
    useEffect(() => {
        const initialize = async () => {
            try {
                // Initialize runtime API URL
                await initializeApiUrl();

                // Load user from cookies
                const userCookie = Cookies.get('user');
                if (userCookie) {
                    setUser(JSON.parse(userCookie));
                }
            } catch {
                Cookies.remove('user');
            } finally {
                setIsLoading(false);
            }
        };
        initialize();
    }, []);

    const saveTokens = (tokens: AuthResponse['tokens']) => {
        Cookies.set('accessToken', tokens.accessToken, { expires: 1 });
        Cookies.set('refreshToken', tokens.refreshToken, { expires: 7 });
    };

    const saveUser = (user: User) => {
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
        setUser(user);
    };

    const clearAuth = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
        setUser(null);
    };

    const login = useCallback(
        async (data: LoginData) => {
            const response = await authService.login(data);
            saveTokens(response.tokens);
            saveUser(response.user);

            // Redirect based on role
            if (response.user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        },
        [router]
    );

    const register = useCallback(
        async (data: RegisterData) => {
            const response = await authService.register(data);
            saveTokens(response.tokens);
            saveUser(response.user);
            router.push('/dashboard');
        },
        [router]
    );

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch {
            // Ignore logout errors
        } finally {
            clearAuth();
            router.push('/login');
        }
    }, [router]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
