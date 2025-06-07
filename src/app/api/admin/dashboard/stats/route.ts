import { NextResponse } from 'next/server';
import { auth } from '@auth';
import prisma from '@/lib/prisma';

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

    // Get total students
    const totalStudents = await prisma.user.count({
      where: { role: 'STUDENT' },
    });

    // Get total mentors
    const totalMentors = await prisma.user.count({
      where: { role: 'MENTOR' },
    });

    // Get total teams
    const totalTeams = await prisma.team.count();

    // Get total projects
    const totalProjects = await prisma.project.count();

    // Get active projects
    const activeProjects = await prisma.project.count({
      where: { status: 'ACTIVE' },
    });

    // Get pending proposals
    const pendingProposals = await prisma.proposal.count({
      where: { state: 'SUBMITTED' },
    });

    return NextResponse.json({
      totalStudents,
      totalMentors,
      totalTeams,
      totalProjects,
      activeProjects,
      pendingProposals,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 