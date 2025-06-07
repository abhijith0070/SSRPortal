'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileIcon } from 'lucide-react';

const proposalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  objectives: z.string().min(50, 'Objectives must be at least 50 characters'),
  methodology: z.string().min(100, 'Methodology must be at least 100 characters'),
  expectedOutcomes: z.string().min(50, 'Expected outcomes must be at least 50 characters'),
  timeline: z.string().min(50, 'Timeline must be at least 50 characters'),
  references: z.string().optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalFormProps {
  initialData?: {
    title: string;
    description: string;
    objectives: string;
    methodology: string;
    expectedOutcomes: string;
    timeline: string;
    references?: string;
    attachment?: string;
  };
  proposalId?: string;
}

export default function ProposalForm({ initialData, proposalId }: ProposalFormProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: initialData
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Debug session state
  console.log('Session status:', status);
  console.log('Session data:', session);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log('Selected file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      setFiles([file]);
    }
  };

  const onSubmit = async (data: ProposalFormData) => {
    try {
      if (status !== 'authenticated' || !session?.user) {
        toast.error('Please sign in to submit a proposal');
        return;
      }

      setIsLoading(true);
      console.log('Starting proposal submission with data:', data);

      // Handle file upload if present
      let attachment = initialData?.attachment || '';
      if (files.length > 0) {
        const file = files[0];
        console.log('Uploading file:', {
          name: file.name,
          type: file.type,
          size: file.size
        });

        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          console.log('Upload response status:', uploadResponse.status);
          
          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('File upload error:', {
              status: uploadResponse.status,
              statusText: uploadResponse.statusText,
              error: errorText
            });
            throw new Error(`File upload failed: ${errorText}`);
          }

          const fileData = await uploadResponse.json();
          console.log('File upload response:', fileData);
          attachment = fileData.url;
        } catch (uploadError: any) {
          console.error('Error during file upload:', uploadError);
          toast.error(`File upload failed: ${uploadError.message}`);
          return;
        }
      }

      // Combine content fields
      const content = `
Objectives:
${data.objectives}

Methodology:
${data.methodology}

Expected Outcomes:
${data.expectedOutcomes}

Timeline:
${data.timeline}

${data.references ? `References:\n${data.references}` : ''}
`.trim();

      // Prepare proposal data
      const proposalData = {
        title: data.title,
        description: data.description,
        content: content,
        attachment: attachment || undefined,
      };

      console.log('Submitting proposal data:', proposalData);

      // Submit or update proposal
      const url = proposalId 
        ? `/api/student/proposals/${proposalId}`
        : '/api/student/proposals';
      
      const method = proposalId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposalData),
      });

      console.log('Proposal submission response status:', response.status);

      let responseData;
      try {
        responseData = await response.json();
        console.log('Proposal submission response:', responseData);
      } catch (e) {
        console.error('Failed to parse response:', e);
        const text = await response.text();
        console.log('Raw response:', text);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        if (responseData.error === 'Validation failed') {
          console.error('Validation errors:', responseData.details);
          responseData.details.forEach((error: any) => {
            toast.error(`${error.path.join('.')}: ${error.message}`);
          });
        } else if (response.status === 404) {
          toast.error('You must be part of a team to submit a proposal');
        } else if (response.status === 401) {
          toast.error('Please sign in again to submit your proposal');
          router.push('/auth/signin');
        } else {
          throw new Error(responseData.message || 'Failed to submit proposal');
        }
        return;
      }

      toast.success(proposalId ? 'Proposal updated successfully!' : 'Proposal submitted successfully!');
      router.push('/dashboard/student/proposals');
    } catch (error: any) {
      console.error('Proposal submission error:', error);
      toast.error(error.message || 'Failed to submit proposal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Project Title</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Project Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Provide a detailed description of your project..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Objectives</label>
        <textarea
          {...register('objectives')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="List the main objectives of your project..."
        />
        {errors.objectives && (
          <p className="mt-1 text-sm text-red-600">{errors.objectives.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Methodology</label>
        <textarea
          {...register('methodology')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Describe your approach and methods..."
        />
        {errors.methodology && (
          <p className="mt-1 text-sm text-red-600">{errors.methodology.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Expected Outcomes</label>
        <textarea
          {...register('expectedOutcomes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="What are the expected results and deliverables?"
        />
        {errors.expectedOutcomes && (
          <p className="mt-1 text-sm text-red-600">{errors.expectedOutcomes.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Timeline</label>
        <textarea
          {...register('timeline')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Provide a project timeline with milestones..."
        />
        {errors.timeline && (
          <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">References</label>
        <textarea
          {...register('references')}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="List any references or sources..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Attachment</label>
        {initialData?.attachment && (
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <FileIcon className="w-4 h-4" />
            <Link href={initialData.attachment} target="_blank" className="hover:underline">
              Current attachment
            </Link>
          </div>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.gif"
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary-dark"
        />
        <p className="mt-1 text-sm text-gray-500">
          Upload a PDF document or image (max 10MB)
        </p>
      </div>

      <div className="flex gap-4 justify-end">
        <Link
          href="/dashboard/student/proposals"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isLoading || status !== 'authenticated'}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : proposalId ? 'Update Proposal' : 'Submit Proposal'}
        </button>
      </div>
    </form>
  );
} 