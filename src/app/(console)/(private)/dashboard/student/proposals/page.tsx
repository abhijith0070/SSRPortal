'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FileIcon, PlusIcon, CheckCircleIcon, XCircleIcon, ClockIcon, PencilIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Proposal {
  id: number;
  title: string;
  description: string;
  state: string;
  attachment?: string;
  created_at: string;
  updated_at: string;
  author: {
    firstName: string;
    lastName: string;
  };
}

export default function ProposalsPage() {
  const { data: session, status } = useSession();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProposals() {
      try {
        const response = await fetch('/api/student/proposals');
        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }
        const data = await response.json();
        // Extract proposals array from response
        setProposals(data.data || []);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        toast.error('Failed to load proposals');
        // Set empty array on error
        setProposals([]);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchProposals();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Please sign in to view proposals</p>
        <Link href="/auth/signin" className="text-primary hover:underline">
          Sign In
        </Link>
      </div>
    );
  }

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'APPROVED':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'DRAFT':
      case 'PENDING':
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (state: string) => {
    switch (state) {
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'DRAFT':
        return 'Draft';
      case 'PENDING':
        return 'Under Review';
      default:
        return state;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project Proposals</h1>
        <Link
          href="/dashboard/student/proposals/create"
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Proposal</span>
        </Link>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500 mb-4">No proposals submitted yet</div>
          <Link
            href="/dashboard/student/proposals/create"
            className="text-primary hover:underline"
          >
            Submit your first proposal
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">
                    {proposal.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(proposal.state)}
                    <span className="text-sm text-gray-600">
                      {getStatusText(proposal.state)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {proposal.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>By {proposal.author.firstName} {proposal.author.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {proposal.attachment && (
                      <Link
                        href={proposal.attachment}
                        target="_blank"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <FileIcon className="w-4 h-4" />
                        <span>View Attachment</span>
                      </Link>
                    )}
                    {proposal.state === 'DRAFT' && (
                      <Link
                        href={`/dashboard/student/proposals/${proposal.id}/edit`}
                        className="flex items-center gap-1 text-primary hover:underline ml-4"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit</span>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-400">
                  Submitted {new Date(proposal.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}