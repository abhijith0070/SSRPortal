import { NextResponse } from 'next/server';
import { auth } from '@auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Get mentors with their details
    const mentors = await prisma.user.findMany({
      where: { role: 'MENTOR' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        team: {
          select: {
            id: true,
            teamNumber: true
          }
        }
      }
    });

    // Get teams with their details
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
        members: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        
      }
    });

    // Get counts
    const stats = {
      totalStudents: await prisma.user.count({ where: { role: 'STUDENT' } }),
      totalMentors: mentors.length,
      totalTeams: teams.length,
      totalProjects: await prisma.project.count(),
      totalThemes: await prisma.theme.count(),
      totalProposals: await prisma.proposal.count(),
      pendingProposals: await prisma.proposal.count({
        where: { state: 'SUBMITTED' },
      }),
    };

    return NextResponse.json({
      stats,
      mentors,
      teams
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}