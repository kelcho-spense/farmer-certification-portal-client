'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="bg-green-700 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold">
                            FarmCert Portal
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-green-200">
                                    Welcome, {user?.name}
                                    {user?.role === 'admin' && (
                                        <span className="ml-2 px-2 py-1 bg-yellow-500 text-xs rounded">
                                            Admin
                                        </span>
                                    )}
                                </span>
                                {user?.role === 'admin' ? (
                                    <Link
                                        href="/admin/dashboard"
                                        className="hover:text-green-200 transition"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        className="hover:text-green-200 transition"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="bg-green-800 hover:bg-green-900 px-4 py-2 rounded-md transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hover:text-green-200 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-white text-green-700 hover:bg-green-100 px-4 py-2 rounded-md transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
