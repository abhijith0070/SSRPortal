import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { type Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await req.json();
    console.log('Received data:', data);

    const result = await prisma.$transaction(async (tx) => {
      // Create team using schema structure
      const team = await tx.team.create({
        data: {
          projectTitle: data.projectTitle,
          projectPillar: data.projectPillar,
          status: 'PENDING',
          batch: data.batch,
          teamNumber: data.teamNumber,
          lead: {
            connect: {
              id: session.user.id
            }
          },
          mentor: data.mentorId ? {
            connect: {
              id: data.mentorId
            }
          } : undefined
        }
      });

      // Create team members including leader
      const teamMembers = await Promise.all([
        // Create leader member
        tx.teamMember.create({
          data: {
            team: {
              connect: { id: team.id }
            },
            user: {
              connect: { id: session.user.id }
            },
            name: `${session.user.firstName} ${session.user.lastName}`,
            email: session.user.email!,
            rollNumber: session.user.mID || undefined,
            role: 'LEADER'
          }
        }),
        // Create other members
        ...data.members.map((member: any) =>
          tx.teamMember.create({
            data: {
              team: {
                connect: { id: team.id }
              },
              user: {
                create: {
                  firstName: member.name.split(' ')[0],
                  lastName: member.name.split(' ')[1] || '',
                  email: member.email,
                  password: '', // Temporary password
                  mID: member.rollNumber
                }
              },
              name: member.name,
              email: member.email,
              rollNumber: member.rollNumber,
              role: 'MEMBER'
            }
          })
        )
      ]);

      return {
        team,
        members: teamMembers
      };
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Error in team creation:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Team number already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create team' },
      { status: 500 }
    );
  }
}