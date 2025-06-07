import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';

async function getTeamDetails(teamId: string) {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  const team = await prisma.team.findFirst({
    where: {
      code: teamId,
      mentorId: session.user.id
    },
    include: {
      members: {
        include: {
          user: true
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

  if (!team) redirect('/dashboard/mentor');
  return team;
}

export default async function TeamDetailPage({ params }: { params: { id: string } }) {
  const team = await getTeamDetails(params.id);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Team Details</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Team Information</h2>
          <p><span className="font-medium">Team Code:</span> {team.code}</p>
          <p><span className="font-medium">Status:</span> {team.status}</p>
          {team.statusReason && (
            <p><span className="font-medium">Status Reason:</span> {team.statusReason}</p>
          )}
        </div>

        {/* Members */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          <ul className="space-y-2">
            {team.members.map((member) => (
              <li key={member.id} className="flex items-center space-x-2">
                <span>{member.user.firstName} {member.user.lastName}</span>
                <span className="text-gray-500">({member.user.email})</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Project Details */}
        {team.project && (
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <p><span className="font-medium">Title:</span> {team.project.title}</p>
            <p><span className="font-medium">Theme:</span> {team.project.theme?.name}</p>
            <p><span className="font-medium">Description:</span></p>
            <p className="mt-2">{team.project.description}</p>
          </div>
        )}

        {/* Proposals */}
        {team.proposals.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Project Proposals</h2>
            {team.proposals.map((proposal) => (
              <div key={proposal.id} className="mb-4 p-4 border rounded">
                <p><span className="font-medium">Title:</span> {proposal.title}</p>
                <p><span className="font-medium">Status:</span> {proposal.status}</p>
                <p className="mt-2">{proposal.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}