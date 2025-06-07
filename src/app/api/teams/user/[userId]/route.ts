import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const team = await prisma.team.findFirst({
      where: {
        OR: [
          { leadId: params.userId },
          {
            members: {
              some: {
                userId: params.userId
              }
            }
          }
        ]
      },
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
    });

    console.log('Found team:', JSON.stringify(team, null, 2)); // Debug log
    return NextResponse.json(team);

  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team data' },
      { status: 500 }
    );
  }
}