import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch team data including members
    const team = await prisma.team.findFirst({
      where: {
        OR: [
          { leadId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                mID: true
              }
            }
          }
        },
        mentor: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!team) {
      return NextResponse.json(null);
    }

    // Transform the data to match ProjectStats interface
    const projectStats = {
      teamName: team.teamNumber,
      projectTitle: team.projectTitle,
      status: team.status,
      completedMilestones: 0, // Add your milestone logic here
      totalMilestones: 5,
      nextDeadline: 'TBD',
      mentorName: team.mentor ? `${team.mentor.firstName} ${team.mentor.lastName}` : 'Not Assigned',
      lastUpdate: new Date(team.updatedAt).toLocaleDateString(),
      members: team.members.map(member => ({
        name: member.user ? `${member.user.firstName} ${member.user.lastName}` : member.name,
        email: member.user ? member.user.email : member.email,
        rollNumber: member.user ? member.user.mID : member.rollNumber,
        isLeader: member.role === 'LEADER'
      })),
      recentActivities: [] // Add your activities logic here
    };

    console.log('Returning project stats:', projectStats); // Debug log
    return NextResponse.json(projectStats);

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}