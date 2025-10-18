import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    }

    const teams = await prisma.team.findMany({
      include: {
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get members for all teams
    const allTeamIds = teams.map(team => team.id);
    const allMembers = await prisma.teamMember.findMany({
      where: {
        teamId: { in: allTeamIds }
      }
    });

    const membersByTeam: Record<string, typeof allMembers> = {};
    for (const member of allMembers) {
      if (!membersByTeam[member.teamId]) {
        membersByTeam[member.teamId] = [];
      }
      membersByTeam[member.teamId].push(member);
    }

    const transformedTeams = teams.map(team => ({
      id: team.id,
      teamNumber: team.teamNumber,
      projectTitle: team.projectTitle,
      status: team.status,
      mentor: team.mentor ? {
        id: team.mentor.id,
        name: `${team.mentor.firstName} ${team.mentor.lastName}`,
        email: team.mentor.email
      } : null,
      members: (membersByTeam[team.id] || []).map(m => ({
        name: m.name,
        email: m.email,
        role: m.role
      })),
      lead: team.lead ? {
        name: `${team.lead.firstName} ${team.lead.lastName}`,
        email: team.lead.email
      } : null,
      project: team.project
    }));

    return NextResponse.json(transformedTeams);
  } catch (error) {
    console.error('Error fetching all teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}