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

    // Get all teams with their members and projects
    const teams = await prisma.team.findMany({
      include: {
        teamMembers: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              }
            },
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
        project: {
          include: {
            theme: true,
          },
        },
        proposals: {
          orderBy: {
            updated_at: 'desc',
          },
          select: {
            id: true,
            title: true,
            state: true,
            updated_at: true,
          },
        },
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const { id, leadId, mentorId, memberIds } = body;

    if (!id || !leadId) {
      return new NextResponse('Team id and lead ID are required', { status: 400 });
    }

    // Create team with teamMembers
    const team = await prisma.team.create({
      data: {
        id,
        lead: { connect: { id: leadId } },
        mentor: mentorId ? { connect: { id: mentorId } } : undefined,
        teamMembers: memberIds ? {
          create: memberIds.map((userId: string) => ({
            user: { connect: { id: userId } },
            role: 'MEMBER',
          })),
        } : undefined,
      },
      include: {
        teamMembers: { include: { user: true } },
        lead: true,
        mentor: true,
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
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

    const body = await req.json();
    const { id, leadId, mentorId, memberIds } = body;

    if (!id) {
      return new NextResponse('Team id is required', { status: 400 });
    }

    // Remove all old teamMembers and add new ones
    await prisma.teamMember.deleteMany({ where: { teamId: id } });
    const team = await prisma.team.update({
      where: { id },
      data: {
        lead: leadId ? { connect: { id: leadId } } : undefined,
        mentor: mentorId ? { connect: { id: mentorId } } : undefined,
        teamMembers: memberIds ? {
          create: memberIds.map((userId: string) => ({
            user: { connect: { id: userId } },
            role: 'MEMBER',
          })),
        } : undefined,
      },
      include: {
        teamMembers: { include: { user: true } },
        lead: true,
        mentor: true,
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Team id is required', { status: 400 });
    }

    // Delete all teamMembers first
    await prisma.teamMember.deleteMany({ where: { teamId: id } });
    // Delete team
    await prisma.team.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting team:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 