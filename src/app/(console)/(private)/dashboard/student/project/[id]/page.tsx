'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProjectForm from '../form';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  theme: "Health and Wellbeing" | "Awareness Campaigns" | "Indian History and Heritage" | "Amrita Talks" | "Financial Literacy" | "21st Century Values" | "Student Mentorship" | "Student Clubs" | "Women Empowerment";
  status: "PLANNING" | "IN_PROGRESS" | "COMPLETED";
  targetBeneficiaries: string;
  socialImpact: string;
  implementationApproach: string;
  currentMilestone: string;
  nextMilestone: string;
  challenges?: string;
  achievements?: string;
  location: {
    type: 'ONLINE' | 'OFFLINE';
    address?: string;
    city?: string;
    state?: string;
  };
  mentorName: string;
  mentorEmail: string;
  updatedAt: string;
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        setError(null);
        const response = await fetch(`/api/student/projects/${params.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch project');
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(error instanceof Error ? error.message : 'Failed to load project');
        toast.error(error instanceof Error ? error.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchProject();
    }
  }, [params.id, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-2">Loading project details...</span>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.push('/dashboard/student/projects')}
            className="mt-4 text-red-600 hover:text-red-800"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>Project not found</p>
          <button
            onClick={() => router.push('/dashboard/student/projects')}
            className="mt-4 text-primary hover:text-primary-dark"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const initialData = {
    title: project.name,
    theme: project.theme,
    mentorName: project.mentorName,
    mentorEmail: project.mentorEmail,
    targetBeneficiaries: project.targetBeneficiaries,
    socialImpact: project.socialImpact,
    implementationApproach: project.implementationApproach,
    status: project.status,
    currentMilestone: project.currentMilestone,
    nextMilestone: project.nextMilestone,
    challenges: project.challenges || '',
    achievements: project.achievements || '',
    location: project.location
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Project' : 'Project Details'}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/dashboard/student/projects')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Back to Projects
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Project'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ProjectForm 
          initialData={initialData} 
          projectId={params.id} 
          isEditing={isEditing}
          onEditComplete={() => setIsEditing(false)}
        />
      </div>
    </div>
  );
} 