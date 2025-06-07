import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

async function getTeamDetails(id: string) {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  const team = await prisma.team.findFirst({
    where: {
      id: id,
      mentorId: session.user.id
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        }
      },
      lead: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      },
      project: {
        include: {
          theme: true
        }
      },
      proposals: true
    }
  });

  if (!team) redirect('/dashboard/mentor/teams');
  return team;
}

type TeamLead = {
  firstName: string;
  lastName: string;
  email: string;
};

type TeamMember = {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
};

type ProjectTheme = {
  name: string;
};

type Project = {
  title: string;
  description: string;
  theme?: ProjectTheme;
};

type Proposal = {
  id: string;
  title: string;
  status: string;
  description: string;
};

// Update Team type to match database schema
type Team = {
  id: string;
  teamNumber: string;
  projectTitle: string;
  projectPillar: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  mentorId: string;
  leadId: string;
  createdAt: Date;
  updatedAt: Date;
  lead: TeamLead;
  members: TeamMember[];
  project?: Project;
  proposals: Proposal[];
};

export default async function TeamDetailPage({ params }: { params: { id: string } }) {
  const team = await getTeamDetails(params.id);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Team Details</h1>
      
      <div className="grid gap-6">
        {/* Team Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">Team {team.teamNumber}</h2>
              <p className="text-gray-600">{team.projectTitle}</p>
              <p className="text-sm text-gray-500">Project Pillar: {team.projectPillar}</p>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${
              team.status === 'APPROVED' 
                ? 'bg-green-100 text-green-800'
                : team.status === 'REJECTED'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {team.status}
            </span>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          
          {/* Team Leader */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Team Leader</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{team.lead.firstName} {team.lead.lastName}</p>
              <p className="text-sm text-gray-600">{team.lead.email}</p>
            </div>
          </div>

          {/* Other Members */}
          <div>
            <h3 className="text-lg font-medium mb-3">Members</h3>
            <div className="grid gap-4">
              {team.members
                .filter(member => !member.user.role.includes('LEADER'))
                .map((member) => (
                  <div 
                    key={member.id} 
                    className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <p className="font-medium">
                      {member.user.firstName} {member.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{member.user.email}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Project Details */}
        {team.project && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <p><span className="font-medium">Title:</span> {team.project.title}</p>
            <p><span className="font-medium">Theme:</span> {team.project.theme?.name}</p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700">{team.project.description}</p>
            </div>
          </div>
        )}

        {/* Proposals */}
        {team.proposals.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Project Proposals</h2>
            <div className="grid gap-4">
              {team.proposals.map((proposal) => (
                <div key={proposal.id} className="p-4 border rounded-lg">
                  <p><span className="font-medium">Title:</span> {proposal.title}</p>
                  <p><span className="font-medium">Status:</span> {proposal.status}</p>
                  <p className="mt-2 text-gray-700">{proposal.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}