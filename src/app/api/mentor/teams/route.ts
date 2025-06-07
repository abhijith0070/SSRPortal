import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all teams where the user is a mentor
    const teams = await prisma.team.findMany({
      where: {
        mentorId: session.user.id
      },
      include: {
        members: {
          include: {
            user: true
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
        proposals: {
          select: {
            id: true,
            title: true,
            state: true,
            updated_at: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match the ITeam interface
    const transformedTeams = teams.map(team => ({
      code: team.id,
      name: team.projectTitle,
      projectTitle: team.projectTitle,
      status: team.status,
      stats: {
        members: team.members.length,
        proposals: team.proposals.length,
        status: team.status
      },
      members: team.members.map(member => ({
        name: `${member.user.firstName} ${member.user.lastName}`,
        email: member.user.email,
        role: member.role
      })),
      lead: team.lead ? {
        name: `${team.lead.firstName} ${team.lead.lastName}`,
        email: team.lead.email
      } : null,
      project: team.project ? {
        id: team.project.id,
        title: team.project.name,
        description: team.project.description,
        theme: team.project.theme?.name
      } : null
    }));

    return NextResponse.json(transformedTeams);
  } catch (error) {
    console.error('Error fetching mentor teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
} 