'use client';

import ProjectForm from '../form';
import { Suspense, useState, useEffect } from 'react';
import ProposalFormGuard from '@/components/ProposalFormGuard';

export default function FormPage() {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Proposal' : 'Submit New Proposal'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit 
            ? 'Update your project proposal and resubmit for review.' 
            : 'Create and submit your project proposal for review.'}
        </p>
      </div>
      
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <ProposalFormGuard>
          <ProjectForm onEditMode={setIsEdit} />
        </ProposalFormGuard>
      </Suspense>
    </div>
  );
}
