'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute, StatusBadge } from '@/components';
import { farmerService } from '@/lib/services';
import { User } from '@/types';

function DashboardContent() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await farmerService.getMyProfile();
                setProfile(data);
            } catch {
                setError('Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-md">
                    {error}
                </div>
            </div>
        );
    }

    const displayData = profile || user;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome, {displayData?.name}!
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Here&apos;s your farmer certification dashboard
                    </p>
                </div>

                {/* Status Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">
                            Certification Status
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Current Status</p>
                                {displayData?.status && (
                                    <StatusBadge status={displayData.status} size="lg" />
                                )}
                            </div>
                            <div className="text-right">
                                {displayData?.status === 'pending' && (
                                    <p className="text-yellow-600 text-sm">
                                        Your application is under review
                                    </p>
                                )}
                                {displayData?.status === 'certified' && (
                                    <p className="text-green-600 text-sm">
                                        Congratulations! You are certified
                                    </p>
                                )}
                                {displayData?.status === 'declined' && (
                                    <p className="text-red-600 text-sm">
                                        Your application was declined
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">Farm Details</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Full Name
                                </label>
                                <p className="text-lg text-gray-900">{displayData?.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Email
                                </label>
                                <p className="text-lg text-gray-900">{displayData?.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Farm Size
                                </label>
                                <p className="text-lg text-gray-900">
                                    {displayData?.farmSize} acres
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Crop Type
                                </label>
                                <p className="text-lg text-gray-900">{displayData?.cropType}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Member Since
                                </label>
                                <p className="text-lg text-gray-900">
                                    {displayData?.createdAt
                                        ? new Date(displayData.createdAt).toLocaleDateString(
                                            'en-US',
                                            {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }
                                        )
                                        : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Explanation */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        What do the statuses mean?
                    </h3>
                    <ul className="space-y-2 text-blue-700">
                        <li className="flex items-center gap-2">
                            <StatusBadge status="pending" size="sm" />
                            <span>Your application is being reviewed by our team</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <StatusBadge status="certified" size="sm" />
                            <span>
                                You have been certified and can access all farmer benefits
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <StatusBadge status="declined" size="sm" />
                            <span>
                                Your application was not approved. Contact support for more info
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute allowedRoles={['farmer']}>
            <DashboardContent />
        </ProtectedRoute>
    );
}
