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
    console.log('Received update data:', body);
    
    const validation = updateTeamSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
      }, { status: 400 });
    }

    const data = validation.data;

    // Find the team first
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
        error: 'No Rejected team found'
      }, { status: 404 });
    }

    // Update in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing non-leader members
      await tx.teamMember.deleteMany({
        where: {
          teamId: existingTeam.id,
          role: 'MEMBER'
        }
      });

      // Create new members one by one
      const newMembers = [];
      for (const member of data.members) {
        // Find or create user
        const user = await tx.user.upsert({
          where: { email: member.email },
          update: {},
          create: {
            email: member.email,
            rollno: member.rollNumber,
            firstName: member.name.split(' ')[0],
            lastName: member.name.split(' ').slice(1).join(' ') || '',
            password: '', // Will be set during registration
            role: 'STUDENT',
            isRegistered: false,
            canLogin: true
          }
        });

        // Create team member
        const teamMember = await tx.teamMember.create({
          data: {
            teamId: existingTeam.id,
            userId: user.id,
            name: member.name,
            email: member.email,
            rollNumber: member.rollNumber,
            role: 'MEMBER'
          }
        });
        newMembers.push(teamMember);
      }

      // Update team
      const updatedTeam = await tx.team.update({
        where: { id: existingTeam.id },
        data: {
          projectTitle: data.projectTitle,
          projectPillar: data.projectPillar,
          status: 'PENDING',
          mentorId: data.mentorId
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

      return {
        ...updatedTeam,
        members: [...updatedTeam.members, ...newMembers]
      };
    }, {
      maxWait: 10000,
      timeout: 20000
    });

    console.log('Team updated successfully:', result);
    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Error updating team:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'Member already exists in another team'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update team'
    }, { status: 500 });
  }
}