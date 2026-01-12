import { CertificationStatus } from '@/types';

interface StatusBadgeProps {
    status: CertificationStatus;
    size?: 'sm' | 'md' | 'lg';
}

const statusStyles: Record<CertificationStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    certified: 'bg-green-100 text-green-800 border-green-300',
    declined: 'bg-red-100 text-red-800 border-red-300',
};

const statusLabels: Record<CertificationStatus, string> = {
    pending: 'Pending',
    certified: 'Certified',
    declined: 'Declined',
};

const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center font-medium rounded-full border ${statusStyles[status]} ${sizeStyles[size]}`}
        >
            {statusLabels[status]}
        </span>
    );
}
