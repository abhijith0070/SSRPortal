'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';

interface ExtendedUser extends User {
  teamId?: string;
}

interface SessionWithUser {
  user?: ExtendedUser;
}

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  mentorName: z.string().min(3, 'Mentor name must be at least 3 characters'),
  mentorEmail: z.string().email('Invalid mentor email'),
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

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const TECH_OPTIONS = [
  // Technical Options
  'React', 'Next.js', 'Node.js', 'Python', 'Django', 'Flask',
  'Java', 'Spring Boot', 'Angular', 'Vue.js', 'MongoDB', 'PostgreSQL',
  'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'Machine Learning', 'AI', 'Blockchain', 'IoT',
  // Social Service Categories
  'Education', 'Healthcare', 'Environment', 'Community Development',
  'Women Empowerment', 'Child Welfare', 'Elder Care', 'Rural Development',
  'Waste Management', 'Water Conservation', 'Digital Literacy', 'Skill Development'
];

export default function ProjectPage() {
  const router = useRouter();
  const { data: session } = useSession() as { data: SessionWithUser | null };
  const [isLoading, setIsLoading] = useState(false);
  const [hasTeam, setHasTeam] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'PLANNING',
      location: {
        type: 'ONLINE'
      }
    }
  });

  useEffect(() => {
    const checkTeam = async () => {
      if (!session?.user?.email) return;
      
      try {
        setIsLoading(true);
        const statsResponse = await fetch('/api/student/dashboard/stats', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log('Team stats:', statsData);
          
          if (statsData && statsData.teamName) {
            setHasTeam(true);
          } else {
            setHasTeam(false);
          }
        } else {
          console.error('Failed to fetch team stats:', await statsResponse.text());
          setHasTeam(false);
        }
      } catch (error) {
        console.error('Error checking team status:', error);
        setHasTeam(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTeam();
  }, [session]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Log the data being sent
      console.log('Submitting project data:', data);

      const response = await fetch('/api/student/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create project';
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.details) {
            errorData.details.forEach((error: any) => {
              const path = Array.isArray(error.path) ? error.path.join('.') : error.path;
              toast.error(`${path}: ${error.message}`);
            });
            throw new Error('Validation failed');
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let responseData;
      try {
        responseData = await response.json();
        console.log('Success response:', responseData);
      } catch (parseError) {
        console.error('Error parsing success response:', parseError);
        toast.success('Project created successfully!');
        router.push('/dashboard/student/projects');
        return;
      }

      toast.success('Project created successfully!');
      router.push('/dashboard/student/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error instanceof Error ? error.message : 'Failed to create project');
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-yellow-700">
            Please sign in to create a project.
          </p>
        </div>
      </div>
    );
  }

  if (!hasTeam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to be part of a team to create a project. Please create or join a team first.
              </p>
              <button
                onClick={() => router.push('/dashboard/student/team')}
                className="mt-2 text-sm text-yellow-700 underline hover:text-yellow-900"
              >
                Go to Team Management
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
        <button
          onClick={() => router.push('/dashboard/student/projects')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back to Projects
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-lg shadow p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Theme</label>
          <select
            {...register('theme')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="Health and Wellbeing">Health and Wellbeing</option>
            <option value="Awareness Campaigns">Awareness Campaigns</option>
            <option value="Indian History and Heritage">Indian History and Heritage</option>
            <option value="Amrita Talks">Amrita Talks</option>
            <option value="Financial Literacy">Financial Literacy</option>
            <option value="21st Century Values">21st Century Values</option>
            <option value="Student Mentorship">Student Mentorship</option>
            <option value="Student Clubs">Student Clubs</option>
            <option value="Women Empowerment">Women Empowerment</option>
          </select>
          {errors.theme && (
            <p className="mt-1 text-sm text-red-600">{errors.theme.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Project Title</label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Enter a descriptive title for your project"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mentor Name</label>
            <input
              type="text"
              {...register('mentorName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Enter mentor's full name"
            />
            {errors.mentorName && (
              <p className="mt-1 text-sm text-red-600">{errors.mentorName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mentor Email</label>
            <input
              type="email"
              {...register('mentorEmail')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Enter mentor's email address"
            />
            {errors.mentorEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.mentorEmail.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Target Beneficiaries</label>
          <textarea
            {...register('targetBeneficiaries')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Describe who will benefit from this project and how it addresses their needs..."
          />
          {errors.targetBeneficiaries && (
            <p className="mt-1 text-sm text-red-600">{errors.targetBeneficiaries.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Social Impact</label>
          <textarea
            {...register('socialImpact')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Describe the expected social impact and positive changes this project will bring..."
          />
          {errors.socialImpact && (
            <p className="mt-1 text-sm text-red-600">{errors.socialImpact.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Implementation Approach</label>
          <textarea
            {...register('implementationApproach')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Describe how you plan to implement this project, including key activities and resources needed..."
          />
          {errors.implementationApproach && (
            <p className="mt-1 text-sm text-red-600">{errors.implementationApproach.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Project Location</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <select
                {...register('location.type')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>
            {watch('location.type') === 'OFFLINE' && (
              <>
                <div>
                  <input
                    type="text"
                    {...register('location.address')}
                    placeholder="Address"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    {...register('location.city')}
                    placeholder="City"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <select
                    {...register('location.state')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="">Select State</option>
                    {STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Project Status</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Current Milestone</label>
          <textarea
            {...register('currentMilestone')}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="What is the current milestone you're working on?"
          />
          {errors.currentMilestone && (
            <p className="mt-1 text-sm text-red-600">{errors.currentMilestone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Next Milestone</label>
          <textarea
            {...register('nextMilestone')}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="What is the next milestone you're planning to achieve?"
          />
          {errors.nextMilestone && (
            <p className="mt-1 text-sm text-red-600">{errors.nextMilestone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Current Challenges</label>
          <textarea
            {...register('challenges')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Describe any current challenges or obstacles you're facing..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recent Achievements</label>
          <textarea
            {...register('achievements')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="List recent project achievements and positive outcomes..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating Project...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
} 