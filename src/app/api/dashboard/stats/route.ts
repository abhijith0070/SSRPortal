import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's team with related data
    const team = await prisma.team.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        project: true,
        activityLogs: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(null);
    }

    // Get milestone progress
    const milestones = await prisma.milestone.findMany({
      where: {
        teamId: team.id,
      },
    });

    const completedMilestones = milestones.filter(m => m.status === 'COMPLETED').length;

    // Format activities
    const recentActivities = team.activityLogs.map(log => ({
      id: log.id,
      type: log.type,
      description: log.description,
      date: log.createdAt.toISOString(),
      user: `${log.user.firstName} ${log.user.lastName}`,
    }));

    // Calculate next deadline
    const nextDeadline = await prisma.milestone.findFirst({
      where: {
        teamId: team.id,
        status: 'IN_PROGRESS',
        dueDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    const stats = {
      teamName: team.name,
      projectTitle: team.project?.title || team.projectTitle,
      status: team.project?.status || team.status,
      completedMilestones,
      totalMilestones: milestones.length,
      nextDeadline: nextDeadline?.dueDate.toISOString() || null,
      mentorName: team.project?.mentorName || null,
      lastUpdate: team.updatedAt.toISOString(),
      recentActivities,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 