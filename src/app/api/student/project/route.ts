import { NextResponse } from 'next/server';
import { auth } from '@auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's team
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { team: true },
    });

    if (!user?.team) {
      return new NextResponse('No team found', { status: 404 });
    }

    // Get active project for the team
    const project = await prisma.project.findFirst({
      where: {
        teamCode: user.team.code,
        status: 'ACTIVE',
      },
      include: {
        team: {
          include: {
            members: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
            lead: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            mentor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        resources: {
          select: {
            id: true,
            title: true,
            type: true,
            link: true,
            description: true,
          },
        },
      },
    });

    if (!project) {
      return new NextResponse('No active project found', { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 