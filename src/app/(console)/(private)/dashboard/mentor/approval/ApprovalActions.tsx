'use client';

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useState as reactUseState } from 'react';

function useState<T>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    return reactUseState(initialValue);
}

export default function ApprovalActions({ teamId }: { teamId: string }) {
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/mentor/approval', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamId,
                    status: 'APPROVED'
                })
            });

            if (!response.ok) throw new Error('Failed to approve team');
            
            toast.success('Team approved successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to approve team');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = (reason: string) => {
        setIsLoading(true);
        fetch('/api/mentor/approval', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teamId,
                status: 'REJECTED',
                reason
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to reject team');
            toast.success('Team rejected');
            router.refresh();
        })
        .catch(() => toast.error('Failed to reject team'))
        .finally(() => {
            setIsLoading(false);
            setIsRejectModalOpen(false);
        });
    };

    return {
        handleApprove,
        handleReject,
        isRejectModalOpen,
        setIsRejectModalOpen,
        isLoading
    };
}

