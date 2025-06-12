'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export type TeamStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ProjectPillar = 
  'DRUG_AWARENESS' | 
  'CYBERSECURITY_AWARENESS' | 
  'HEALTH_AND_WELLBEING' | 
  'INDIAN_CULTURE_AND_HERITAGE' | 
  'SKILL_BUILDING' | 
  'ENVIRONMENTAL_INITIATIVES' | 
  'WOMEN_EMPOWERMENT' | 
  'PEER_MENTORSHIP' | 
  'TECHNICAL_PROJECTS' | 
  'FINANCIAL_LITERACY';

interface UpdateTeamFormProps {
  id: string;
  currentStatus: TeamStatus;
  currentProjectTitle: string;
  currentProjectPillar: ProjectPillar;
  currentTeamNumber: string;
  currentMembers: Array<{
    id: string;
    name: string;
    email: string;
    rollNumber: string;
  }>;
}

export default function UpdateTeamForm({ 
  id, 
  currentStatus, 
  currentProjectTitle, 
  currentProjectPillar,
  currentTeamNumber,
  currentMembers
}: UpdateTeamFormProps) {
  const [status, setStatus] = useState<TeamStatus>(currentStatus);
  const [projectTitle, setProjectTitle] = useState(currentProjectTitle);
  const [projectPillar, setProjectPillar] = useState(currentProjectPillar);
  const [teamNumber, setTeamNumber] = useState(currentTeamNumber);
  const [members, setMembers] = useState(currentMembers);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/mentor/teams/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          projectTitle,
          projectPillar,
          teamNumber,
          members
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update team');
      }

      toast.success('Team updated successfully!');
      router.push(`/dashboard/mentor/teams/${id}`);
      router.refresh();

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update team');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Update Team</h2>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="teamNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Team Number
              </label>
              <input
                type="text"
                id="teamNumber"
                value={teamNumber}
                onChange={(e) => setTeamNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TeamStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="projectPillar" className="block text-sm font-medium text-gray-700 mb-1">
              Project Pillar
            </label>
            <select
              id="projectPillar"
              value={projectPillar}
              onChange={(e) => setProjectPillar(e.target.value as ProjectPillar)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="DRUG_AWARENESS">Drug Awareness</option>
              <option value="CYBERSECURITY_AWARENESS">Cybersecurity Awareness</option>
              <option value="HEALTH_AND_WELLBEING">Health and Wellbeing</option>
              <option value="INDIAN_CULTURE_AND_HERITAGE">Indian Culture and Heritage</option>
              <option value="SKILL_BUILDING">Skill Building</option>
              <option value="ENVIRONMENTAL_INITIATIVES">Environmental Initiatives</option>
              <option value="WOMEN_EMPOWERMENT">Women Empowerment</option>
              <option value="PEER_MENTORSHIP">Peer Mentorship</option>
              <option value="TECHNICAL_PROJECTS">Technical Projects</option>
              <option value="FINANCIAL_LITERACY">Financial Literacy</option>
            </select>
          </div>


          

          <div className="border-t pt-6">
            <div className="flex justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Team'
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}