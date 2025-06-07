import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const team = await prisma.team.findFirst({
      where: {
        id: params.id,
        mentorId: session.user.id
      },
      include: {
        members: {
          include: {
            user: true
          }
        },
        proposals: true,
        project: true
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({
      code: team.project.code,
      name: team.teamNumber,
      status: team.status,
      members: team.members.map(member => ({
        name: `${member.user.firstName} ${member.user.lastName}`,
        email: member.user.email,
        role: member.user.role
      })),
      proposals: team.proposals,
      project: team.project
    });
  } catch (error) {
    console.error('Error getting team details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}