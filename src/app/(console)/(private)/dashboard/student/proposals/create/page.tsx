'use client';

import ProposalForm from '../form';

export default function CreateProposalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Submit Project Proposal</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ProposalForm />
      </div>
    </div>
  );
} 