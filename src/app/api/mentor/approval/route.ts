import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || !session.user.isStaff) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, action, reason } = await req.json();

    if (!teamId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        mentorId: session.user.id,
        status: 'PENDING'
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        statusMessage: reason || null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: `Team ${action.toLowerCase()}d successfully`,
      team: updatedTeam
    });

  } catch (error) {
    console.error('Error processing team approval:', error);
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    );
  }
}