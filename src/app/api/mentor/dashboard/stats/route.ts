import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get mentor's projects and teams
    const [projects, teams] = await Promise.all([
      prisma.project.findMany({
        where: {
          Team: { mentorId: session.user.id }
        },
        include: {
          Team: true,
          theme: true
        }
      }),
      prisma.team.findMany({
        where: {
          mentorId: session.user.id
        },
        include: {
          members: true,
          project: true
        }
      })
    ]);

    // Calculate comprehensive stats
    const stats = {
      mentorInfo: {
        name: `${session.user.firstName} ${session.user.lastName}`,
        email: session.user.email
      },
      teams: {
        total: teams.length,
        pending: teams.filter(team => team.status === 'PENDING').length,
        approved: teams.filter(team => team.status === 'APPROVED').length,
        rejected: teams.filter(team => team.status === 'REJECTED').length
      },
      projects: {
        total: projects.length,
        pending: projects.filter(project => !project.isAccepted).length,
        approved: projects.filter(project => project.isAccepted).length,
        byTheme: projects.reduce((acc, project) => {
          const themeName = project.theme?.name || 'Uncategorized';
          acc[themeName] = (acc[themeName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      students: {
        total: teams.reduce((acc, team) => acc + team.members.length, 0)
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting mentor stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}