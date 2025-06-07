'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface TeamProps {
  id: string;
  teamNumber: string; // Add this
  projectTitle: string;
  projectPillar: string;
  batch: string; // Add this
  lead: {
    firstName: string;
    lastName: string;
    email: string;
    rollNumber?: string;
  };
  members: Array<{
    name: string;
    email: string;
    rollNumber: string;
  }>;
}

export default function TeamApproval({ team }: { team: TeamProps }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const router = useRouter();

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/mentor/teams/approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId: team.id,
          status: action,
          reason: action === 'REJECT' ? rejectReason : undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process team action');
      }

      toast.success(`Team ${action.toLowerCase()}d successfully`);
      setShowRejectModal(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to process team action');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold">Team {team.teamNumber}</h3>
          <p className="text-gray-600">{team.projectTitle}</p>
          <p className="text-sm text-gray-500">
            Batch: {team.batch} • Pillar: {team.projectPillar}
          </p>
        </div>
        <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
          Pending Approval
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2">Team Leader</h3>
          <div className="space-y-1">
            <p>{team.lead.firstName} {team.lead.lastName}</p>
            <p className="text-sm text-gray-500">{team.lead.email}</p>
            {team.lead.rollNumber && (
              <p className="text-sm text-gray-500">Roll: {team.lead.rollNumber}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Team Members</h3>
          <ul className="space-y-2">
            {team.members.map((member, index) => (
              <li key={index} className="text-sm">
                <p>{member.name}</p>
                <p className="text-gray-500">{member.email}</p>
                <p className="text-gray-500">Roll: {member.rollNumber}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => handleAction('APPROVE')}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Approve Team'}
        </button>
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Reject Team
        </button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Reject Team</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full p-2 border rounded mb-4 h-32"
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction('REJECT')}
                disabled={!rejectReason.trim() || isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}