import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';
import { hash } from 'bcryptjs';

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

    // Find existing rejected team
    const existingTeam = await prisma.team.findFirst({
      where: {
        status: 'REJECTED',
        members: {
          some: {
            userId: session.user.id,
            role: 'LEADER'
          }
        }
      }
    });

    if (!existingTeam) {
      return NextResponse.json({
        success: false,
        error: 'No rejected team found'
      }, { status: 404 });
    }

    // Update team in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing non-leader members
      await tx.teamMember.deleteMany({
        where: {
          teamId: existingTeam.id,
          role: 'MEMBER'
        }
      });

      // Create or connect users first
      const memberUsers = await Promise.all(
        data.members.map(async (member) => {
          const defaultPassword = await hash(member.rollNumber, 12);
          return tx.user.upsert({
            where: { email: member.email },
            update: {},
            create: {
              email: member.email,
              firstName: member.name.split(' ')[0],
              lastName: member.name.split(' ').slice(1).join(' ') || '',
              password: defaultPassword,
              role: 'STUDENT',
              isRegistered: true,
              canLogin: true
            }
          });
        })
      );

      // Update team
      const updatedTeam = await tx.team.update({
        where: { id: existingTeam.id },
        data: {
          projectTitle: data.projectTitle,
          projectPillar: data.projectPillar,
          status: 'PENDING',
          mentorId: data.mentorId,
          members: {
            createMany: {
              data: data.members.map((member, index) => ({
                userId: memberUsers[index].id,
                email: member.email,
                name: member.name,
                rollNumber: member.rollNumber,
                role: 'MEMBER'
              }))
            }
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
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update team'
    }, { status: 500 });
  }
}