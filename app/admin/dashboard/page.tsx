'use client';

import { useEffect, useState, useCallback } from 'react';
import { ProtectedRoute, StatusBadge } from '@/components';
import { farmerService } from '@/lib/services';
import { User, CertificationStatus } from '@/types';

function AdminDashboardContent() {
    const [farmers, setFarmers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<CertificationStatus | 'all'>('all');

    const fetchFarmers = useCallback(async () => {
        try {
            const data = await farmerService.getAllFarmers();
            setFarmers(data);
        } catch {
            setError('Failed to load farmers');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFarmers();
    }, [fetchFarmers]);

    const handleStatusUpdate = async (
        farmerId: string,
        newStatus: CertificationStatus
    ) => {
        setUpdatingId(farmerId);
        try {
            const updatedFarmer = await farmerService.updateFarmerStatus(farmerId, {
                status: newStatus,
            });
            setFarmers((prev) =>
                prev.map((f) =>
                    f.id === farmerId ? { ...f, status: updatedFarmer.status } : f
                )
            );
        } catch {
            setError('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredFarmers =
        filter === 'all'
            ? farmers
            : farmers.filter((f) => f.status === filter);

    const stats = {
        total: farmers.length,
        pending: farmers.filter((f) => f.status === 'pending').length,
        certified: farmers.filter((f) => f.status === 'certified').length,
        declined: farmers.filter((f) => f.status === 'declined').length,
    };

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Manage farmer certifications
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                        {error}
                        <button
                            onClick={() => setError('')}
                            className="ml-4 text-red-800 underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-500">Total Farmers</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg shadow p-6 border border-yellow-200">
                        <p className="text-sm text-yellow-700">Pending</p>
                        <p className="text-3xl font-bold text-yellow-800">{stats.pending}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg shadow p-6 border border-green-200">
                        <p className="text-sm text-green-700">Certified</p>
                        <p className="text-3xl font-bold text-green-800">
                            {stats.certified}
                        </p>
                    </div>
                    <div className="bg-red-50 rounded-lg shadow p-6 border border-red-200">
                        <p className="text-sm text-red-700">Declined</p>
                        <p className="text-3xl font-bold text-red-800">{stats.declined}</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="mb-6 flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                        Filter by status:
                    </label>
                    <select
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value as CertificationStatus | 'all')
                        }
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="certified">Certified</option>
                        <option value="declined">Declined</option>
                    </select>
                    <span className="text-gray-500 text-sm">
                        Showing {filteredFarmers.length} farmers
                    </span>
                </div>

                {/* Farmers Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Farmer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Farm Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registered
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredFarmers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            No farmers found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredFarmers.map((farmer) => (
                                        <tr key={farmer.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {farmer.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {farmer.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {farmer.farmSize} acres
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {farmer.cropType}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={farmer.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(farmer.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    {farmer.status !== 'certified' && (
                                                        <button
                                                            onClick={() =>
                                                                handleStatusUpdate(farmer.id, 'certified')
                                                            }
                                                            disabled={updatingId === farmer.id}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 transition"
                                                        >
                                                            {updatingId === farmer.id
                                                                ? '...'
                                                                : 'Certify'}
                                                        </button>
                                                    )}
                                                    {farmer.status !== 'declined' && (
                                                        <button
                                                            onClick={() =>
                                                                handleStatusUpdate(farmer.id, 'declined')
                                                            }
                                                            disabled={updatingId === farmer.id}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 transition"
                                                        >
                                                            {updatingId === farmer.id
                                                                ? '...'
                                                                : 'Decline'}
                                                        </button>
                                                    )}
                                                    {farmer.status !== 'pending' && (
                                                        <button
                                                            onClick={() =>
                                                                handleStatusUpdate(farmer.id, 'pending')
                                                            }
                                                            disabled={updatingId === farmer.id}
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 transition"
                                                        >
                                                            {updatingId === farmer.id
                                                                ? '...'
                                                                : 'Reset'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
