import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

const updateTeamSchema = z.object({
  projectTitle: z.string().min(5),
  projectPillar: z.string(),
  batch: z.string(),
  members: z.array(z.object({
    name: z.string(),
    email: z.string().email(),
    rollNumber: z.string()
  })).min(3).max(5),
  mentorId: z.string().optional()
});

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = updateTeamSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
      }, { status: 400 });
    }

    const data = validation.data;

    // First find the team outside the transaction
    const existingTeam = await prisma.team.findFirst({
      where: {
        status: 'REJECTED',
        members: {
          some: {
            userId: session.user.id,
            role: 'LEADER'
          }
        }
      },
      include: {
        members: true
      }
    });

    if (!existingTeam) {
      return NextResponse.json({
        success: false,
        error: 'No rejected team found'
      }, { status: 404 });
    }

    // Now do the update in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      // First delete existing members
      await tx.teamMember.deleteMany({
        where: {
          AND: [
            { teamId: existingTeam.id },
            { role: 'MEMBER' }
          ]
        }
      });

      // Then update the team and create new members
      const updatedTeam = await tx.team.update({
        where: { id: existingTeam.id },
        data: {
          projectTitle: data.projectTitle,
          projectPillar: data.projectPillar,
          status: 'PENDING',
          mentorId: data.mentorId,
          members: {
            create: data.members.map(member => ({
              name: member.name,
              email: member.email,
              rollNumber: member.rollNumber,
              role: 'MEMBER',
              user: {
                connect: {
                  email: member.email
                }
              }
            }))
          }
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          mentor: true
        }
      });

      return updatedTeam;
    }, {
      maxWait: 5000, // 5 seconds max wait time
      timeout: 10000 // 10 seconds timeout
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error updating team:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2028') {
      return NextResponse.json({
        success: false,
        error: 'Transaction failed, please try again'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update team'
    }, { status: 500 });
  }
}