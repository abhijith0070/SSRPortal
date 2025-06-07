import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await req.json();
    const { teamId, status, reason } = data;

    // Verify mentor is assigned to this team
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        mentorId: session.user.id
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Update team status
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        status: status === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        statusMessage: reason
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedTeam
    });

  } catch (error: any) {
    console.error('Error in team approval:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process team approval' },
      { status: 500 }
    );
  }
}