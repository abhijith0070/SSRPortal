'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Match the API schema exactly
const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Invalid email format')
    .endsWith('@am.students.amrita.edu', 'Must be an Amrita student email (@am.students.amrita.edu)'),
  rollNumber: z.string().min(5, 'Invalid roll number'),
});

type ProjectPillar = 'DRUG_AWARENESS' | 'CYBERSECURITY_AWARENESS' | 'HEALTH_AND_WELLBEING' | 
  'INDIAN_CULTURE_AND_HERITAGE' | 'SKILL_BUILDING' | 'ENVIRONMENTAL_INITIATIVES' | 
  'WOMEN_EMPOWERMENT' | 'PEER_MENTORSHIP' | 'TECHNICAL_PROJECTS' | 'FINANCIAL_LITERACY';

const teamSchema = z.object({
  projectTitle: z.string().min(5, 'Project title must be at least 5 characters'),
  projectPillar: z.enum([
    'DRUG_AWARENESS',
    'CYBERSECURITY_AWARENESS',
    'HEALTH_AND_WELLBEING',
    'INDIAN_CULTURE_AND_HERITAGE',
    'SKILL_BUILDING',
    'ENVIRONMENTAL_INITIATIVES',
    'WOMEN_EMPOWERMENT',
    'PEER_MENTORSHIP',
    'TECHNICAL_PROJECTS',
    'FINANCIAL_LITERACY'
  ] as const, {
    required_error: "Project pillar is required",
    invalid_type_error: "Invalid project pillar selected"
  }),
  mentorId: z.string().min(1, 'Mentor selection is required'),
  batch: z.string().min(1, 'Batch selection is required'),
  teamNumber: z.string().min(1, 'Team number selection is required'),
  members: z.array(teamMemberSchema)
    .min(3, 'Minimum 3 additional members required (you\'ll be added as leader automatically)')
    .max(5, 'Maximum 5 additional members allowed (including you as leader makes 6 total)'),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface TeamFormProps {
  initialData?: {
    // teamName: string;
    projectTitle: string;
    projectPillar: ProjectPillar;
    mentorId: string;
    batch: string;
    teamNumber: string;
    members: Array<{
      name: string;
      email: string;
      rollNumber: string;
    }>;
  };
  isEditing?: boolean;
}

export default function TeamForm({ initialData, isEditing = false }: TeamFormProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [mentors, setMentors] = useState<Array<{ id: string; name: string }>>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  // Fetch mentors when component mounts
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch('/api/mentors');
        if (response.ok) {
          const data = await response.json();
          setMentors(data.map((mentor: any) => ({
            id: mentor.id,
            name: `${mentor.firstName} ${mentor.lastName}`
          })));
        }
      } catch (error) {
        console.error('Error fetching mentors:', error);
        toast.error('Failed to load mentors');
      }
    };

    fetchMentors();
  }, []);

  // Log session data when it changes
  useEffect(() => {
    console.log('Session Status:', status);
    console.log('Session Data:', session);
  }, [session, status]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: initialData || {
      // teamName: '',
      projectTitle: '',
      projectPillar: 'DRUG_AWARENESS',
      mentorId: '',
      batch: '',
      teamNumber: '',
      members: [{
        name: '',
        email: '',
        rollNumber: '',
      }],
    },
  });

  // Reset form with initial data when editing and data changes
  useEffect(() => {
    if (initialData && isEditing) {
      console.log('Resetting form with data:', initialData);
      reset(initialData);
    }
  }, [initialData, isEditing, reset]);

  const members = watch('members');

  const addMember = () => {
    if (members.length < 6) {
      setValue('members', [...members, {
        name: '',
        email: '',
        rollNumber: '',
      }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > 3) { // Changed from 4 to 3 since leader is separate
      const newMembers = members.filter((_, i) => i !== index);
      setValue('members', newMembers);
    } else {
      toast.error('Team must have at least 3 additional members (you\'ll be added as leader automatically)');
    }
  };

  const onSubmit = async (data: TeamFormData) => {
    try {
      setIsLoading(true);
      console.log('Form submitted with data:', data);

      if (!session?.user) {
        throw new Error('No session found');
      }

      const payload = {
        projectTitle: data.projectTitle,
        projectPillar: data.projectPillar,
        teamNumber: data.teamNumber,
        batch: data.batch,
        mentorId: data.mentorId,
        // No need to send leader info since it's handled by session
        members: data.members.map(member => ({
          name: member.name,
          email: member.email,
          rollNumber: member.rollNumber
        }))
      };

      console.log('Sending payload:', payload);

      const response = await fetch('/api/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create team');
      }

      // Show success message and prevent form resubmission
      setIsSubmitted(true);
      toast.success('Team request submitted! Waiting for mentor approval.');

    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to create team');
    } finally {
      setIsLoading(false);
    }
  };

  // Batch options and mapping to team numbers (from provided image)
  const batchOptions = [
    { label: 'AI A', value: 'AI_A', range: [1, 12] },
    { label: 'AI B', value: 'AI_B', range: [13, 23] },
    { label: 'AI-DS', value: 'AI_DS', range: [24, 34] },
    { label: 'CYS', value: 'CYS', range: [35, 41] },
    { label: 'CSE A', value: 'CSE_A', range: [42, 52] },
    { label: 'CSE B', value: 'CSE_B', range: [53, 64] },
    { label: 'CSE C', value: 'CSE_C', range: [65, 77] },
    { label: 'CSE D', value: 'CSE_D', range: [78, 89] },
    { label: 'ECE A', value: 'ECE_A', range: [90, 99] },
    { label: 'ECE B', value: 'ECE_B', range: [100, 112] },
    { label: 'EAC', value: 'EAC', range: [113, 123] },
    { label: 'ELC', value: 'ELC', range: [124, 132] },
    { label: 'EEE', value: 'EEE', range: [133, 140] },
    { label: 'ME', value: 'ME', range: [141, 150] },
    { label: 'RAE', value: 'RAE', range: [151, 160] }
  ];

  const [selectedBatch, setSelectedBatch] = useState<string>('');

  // Get the team numbers for the selected batch
  const filteredTeamOptions = (() => {
    const batch = batchOptions.find(b => b.label === selectedBatch);
    if (!batch) return [];
    const [start, end] = batch.range;
    return Array.from({ length: end - start + 1 }, (_, i) => {
      const num = (start + i).toString().padStart(3, '0');
      return `SSR 25-${num}`;
    });
  })();

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">Please log in to manage your team.</p>
      </div>
    );
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started...');
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Submitting team request...');
      
      // Call the onSubmit handler
      await handleSubmit(async (data) => {
        try {
          console.log('Submitting data:', data);
          await onSubmit(data);
          toast.dismiss(loadingToast);
          toast.success('Team request submitted! Awaiting mentor approval.');
          router.push('/dashboard/student');
        } catch (error: any) {
          console.error('Submission error:', error);
          toast.dismiss(loadingToast);
          toast.error(error.message || 'Failed to submit team request');
        }
      })(e);
    } catch (error: any) {
      console.error('Form validation error:', error);
      toast.error('Please check all required fields');
    }
  };

  // Add success state render
  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Team Request Submitted!</h2>
        <div className="space-y-2 text-green-700">
          <p>Your team request has been submitted successfully.</p>
          <p>Team Number: {watch('teamNumber')}</p>
          <p>Status: Awaiting mentor approval</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/student')}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
        <p className="text-blue-700">
          You will be the team leader using your registered email: {session?.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            value={selectedBatch}
            onChange={e => {
              setSelectedBatch(e.target.value);
              setValue('batch', e.target.value);
              setValue('teamNumber', ''); // reset team number when batch changes
            }}
          >
            <option value="">Select a batch</option>
            {batchOptions.map(batch => (
              <option key={batch.label} value={batch.label}>{batch.label}</option>
            ))}
          </select>
          {errors.batch && (
            <p className="mt-1 text-sm text-red-600">{errors.batch.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Team Number</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            {...register('teamNumber')}
            value={watch('teamNumber')}
            onChange={e => setValue('teamNumber', e.target.value)}
            disabled={!selectedBatch}
          >
            <option value="">{selectedBatch ? 'Select a team number' : 'Select a batch first'}</option>
            {filteredTeamOptions.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
          {errors.teamNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.teamNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Project Title</label>
          <input
            type="text"
            {...register('projectTitle')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
          {errors.projectTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.projectTitle.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Project Pillar</label>
          <select
            {...register('projectPillar')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            autoComplete="off"
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
          {errors.projectPillar && (
            <p className="mt-1 text-sm text-red-600">{errors.projectPillar.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mentor</label>
          <select
            {...register('mentorId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">Select a mentor</option>
            {mentors.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.name}
              </option>
            ))}
          </select>
          {errors.mentorId && (
            <p className="mt-1 text-sm text-red-600">{errors.mentorId.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Team Members (excluding you as leader)
        </label>
        {members.map((_, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <input
                type="text"
                {...register(`members.${index}.name`)}
                placeholder="Name"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.members?.[index]?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.members[index]?.name?.message}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                {...register(`members.${index}.email`)}
                placeholder="Email"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.members?.[index]?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.members[index]?.email?.message}</p>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                {...register(`members.${index}.rollNumber`)}
                placeholder="Roll Number"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.members?.[index]?.rollNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.members[index]?.rollNumber?.message}</p>
              )}
              {members.length > 4 && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="absolute right-0 top-0 px-2 py-1 text-sm text-red-600 hover:text-red-800 border border-red-600 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        {members.length < 5 && (
          <button
            type="button"
            onClick={addMember}
            className="mt-2 text-sm text-primary hover:text-primary-dark"
          >
            + Add Member ({3 - members.length} more required)
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || status !== 'authenticated'}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Submitting...</span>
          </>
        ) : (
          'Create Team'
        )}
      </button>
    </form>
  );
}

declare module "next-auth" {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    emailVerified: Date;
    image: string;
    isAdmin: boolean;
    isStaff: boolean;
    isRegistered: boolean;
    canLogin: boolean;
    mID: string;
    role: string;
    rollNumber?: string;
  }
}