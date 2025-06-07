'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type RejectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

const RejectModal = ({ isOpen, onClose, onConfirm }: RejectModalProps) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    onConfirm(reason);
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Reject Team</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Reason for Rejection
            </label>
            <textarea
              className="w-full border rounded-md p-2 h-32"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for rejecting this team..."
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ApprovalActions({ teamId }: { teamId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const router = useRouter();

  const handleTeamAction = async (action: 'APPROVED' | 'REJECTED', reason?: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/mentor/approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId,
          status: action,
          reason: reason || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update team status');
      }

      toast.success(`Team ${action.toLowerCase()} successfully`);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update team status');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = (reason: string) => {
    handleTeamAction('REJECTED', reason);
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => handleTeamAction('APPROVED')}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Approve'}
        </button>
        <button
          onClick={() => setIsRejectModalOpen(true)}
          disabled={isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Reject'}
        </button>
      </div>

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleReject}
      />
    </>
  );
}