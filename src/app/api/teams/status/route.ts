import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get team where user is a member
    const teamMember = await prisma.teamMember.findFirst({
      where: { userId: session.user.id },
      include: {
        team: {
          include: {
            members: true,
            mentor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!teamMember) {
      return NextResponse.json({ 
        success: true,
        data: { hasTeam: false }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        hasTeam: true,
        team: teamMember.team,
        isRejected: teamMember.team.status === 'REJECTED'
      }
    });

  } catch (error) {
    console.error('Error fetching team status:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch team status'
    }, { status: 500 });
  }
}