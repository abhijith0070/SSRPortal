import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { TEAM_STATUS } from '@/app/(console)/types';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the team where the user is a member
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    mID: true,
                  },
                },
              },
            },
            mentor: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                mID: true,
              },
            },
            proposals: {
              select: {
                id: true,
                title: true,
                description: true,
                created_at: true,
              },
            },
            project: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!teamMember?.team) {
      return NextResponse.json(null);
    }

    // Transform the data to match ITeam interface
    const team = {
      code: teamMember.team.project?.id || '',
      name: teamMember.team.teamNumber,
      mentor: teamMember.team.mentor ? {
        uid: teamMember.team.mentor.mID,
        name: `${teamMember.team.mentor.firstName} ${teamMember.team.mentor.lastName}`,
        email: teamMember.team.mentor.email,
      } : null,
      members: teamMember.team.members.map(member => [
        `${member.user.firstName} ${member.user.lastName}`,
        member.user.email,
      ]),
      proposals: teamMember.team.proposals.map(proposal => ({
        id: proposal.id,
        title: proposal.title,
        description: proposal.description,
        timestamp: proposal.created_at.toISOString(),
      })),
      project: teamMember.team.project ? {
        id: teamMember.team.project.id,
        title: teamMember.team.project.name,
        description: teamMember.team.project.description,
        team: null, // Avoid circular reference
      } : null,
      stats: {
        proposals: teamMember.team.proposals.length,
        members: teamMember.team.members.length,
        status: teamMember.team.status as TEAM_STATUS,
      },
    };

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching team details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team details' },
      { status: 500 }
    );
  }
} 