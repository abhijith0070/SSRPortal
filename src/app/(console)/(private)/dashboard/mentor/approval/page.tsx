import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import TeamApproval from './TeamApproval';

export default async function ApprovalPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  const pendingTeams = await prisma.team.findMany({
    where: {
      mentorId: session.user.id,
      status: 'PENDING'
    },
    include: {
      members: {
        include: {
          user: true
        }
      },
      lead: true,
      project: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Team Approval Requests</h1>
      
      {pendingTeams.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No pending teams to approve</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingTeams.map((team) => (
            <TeamApproval
              key={team.id}
              team={{
                ...team,
                lead: (team as any).lead,
                members: team.members
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}