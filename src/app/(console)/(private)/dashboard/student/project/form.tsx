'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  theme: z.enum([
    'Health and Wellbeing',
    'Awareness Campaigns',
    'Indian History and Heritage',
    'Amrita Talks',
    'Financial Literacy',
    '21st Century Values',
    'Student Mentorship',
    'Student Clubs',
    'Women Empowerment'
  ]),
  mentorName: z.string().min(3, 'Mentor name must be at least 3 characters'),
  mentorEmail: z.string().email('Invalid mentor email'),
  targetBeneficiaries: z.string().min(50, 'Target beneficiaries description must be at least 50 characters'),
  socialImpact: z.string().min(100, 'Social impact description must be at least 100 characters'),
  implementationApproach: z.string().min(100, 'Implementation approach must be at least 100 characters'),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED']),
  currentMilestone: z.string().min(5, 'Current milestone must be at least 5 characters'),
  nextMilestone: z.string().min(5, 'Next milestone must be at least 5 characters'),
  challenges: z.string().optional(),
  achievements: z.string().optional(),
  location: z.object({
    type: z.enum(['ONLINE', 'OFFLINE']),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional()
  })
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: ProjectFormData;
  projectId?: string;
  isEditing?: boolean;
  onEditComplete?: () => void;
}

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function ProjectForm({ initialData, projectId, isEditing = true, onEditComplete }: ProjectFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      status: 'PLANNING',
      location: {
        type: 'ONLINE'
      }
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const url = projectId 
        ? `/api/student/projects/${projectId}`
        : '/api/student/projects';
      
      const response = await fetch(url, {
        method: projectId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.details) {
          // Handle validation errors
          const errorMessage = responseData.details
            .map((err: any) => err.message)
            .join('\n');
          throw new Error(errorMessage);
        }
        throw new Error(responseData.message || 'Failed to save project');
      }

      toast.success(projectId ? 'Project updated successfully!' : 'Project created successfully!');
      
      if (onEditComplete) {
        onEditComplete();
      } else {
        router.push('/dashboard/student/projects');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save project');
    }
  };

  const renderField = (
    label: string,
    field: keyof ProjectFormData,
    type: 'text' | 'textarea' | 'select' = 'text',
    options?: string[],
    rows: number = 3
  ) => {
    const commonClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" + 
      (!isEditing ? " bg-gray-50 cursor-not-allowed" : "");

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {type === 'textarea' ? (
          <textarea
            {...register(field as any)}
            rows={rows}
            className={commonClasses}
            disabled={!isEditing}
          />
        ) : type === 'select' ? (
          <select
            {...register(field as any)}
            className={commonClasses}
            disabled={!isEditing}
          >
            {options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            {...register(field as any)}
            className={commonClasses}
            disabled={!isEditing}
          />
        )}
        {errors[field] && (
          <p className="mt-1 text-sm text-red-600">{errors[field]?.message}</p>
        )}
      </div>
    );
  };

  const locationType = watch('location.type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {renderField('Project Theme', 'theme', 'select', [
        'Health and Wellbeing',
        'Awareness Campaigns',
        'Indian History and Heritage',
        'Amrita Talks',
        'Financial Literacy',
        '21st Century Values',
        'Student Mentorship',
        'Student Clubs',
        'Women Empowerment'
      ])}

      {renderField('Project Title', 'title')}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderField('Mentor Name', 'mentorName')}
        {renderField('Mentor Email', 'mentorEmail')}
      </div>

      {renderField('Target Beneficiaries', 'targetBeneficiaries', 'textarea')}
      {renderField('Social Impact', 'socialImpact', 'textarea')}
      {renderField('Implementation Approach', 'implementationApproach', 'textarea')}

      <div>
        <label className="block text-sm font-medium text-gray-700">Project Location</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          <select
            {...register('location.type')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            disabled={!isEditing}
          >
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>

          {locationType === 'OFFLINE' && (
            <>
              <input
                type="text"
                {...register('location.address')}
                placeholder="Address"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                disabled={!isEditing}
              />
              <input
                type="text"
                {...register('location.city')}
                placeholder="City"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                disabled={!isEditing}
              />
              <select
                {...register('location.state')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                disabled={!isEditing}
              >
                <option value="">Select State</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {renderField('Project Status', 'status', 'select', ['PLANNING', 'IN_PROGRESS', 'COMPLETED'])}
      {renderField('Current Milestone', 'currentMilestone', 'textarea', undefined, 2)}
      {renderField('Next Milestone', 'nextMilestone', 'textarea', undefined, 2)}
      {renderField('Current Challenges', 'challenges', 'textarea')}
      {renderField('Recent Achievements', 'achievements', 'textarea')}

      {isEditing && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (projectId ? 'Update Project' : 'Create Project')}
          </button>
        </div>
      )}
    </form>
  );
} 