import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

// Schema for team members (no database validation)
const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Invalid email format')
    .endsWith('@am.students.amrita.edu', 'Must be an Amrita student email (@am.students.amrita.edu)'),
  rollNumber: z.string().min(5, 'Invalid roll number'),
});

// Separate schema for team leader since we don't need roll number
const teamLeaderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Invalid email format')
    .endsWith('@am.students.amrita.edu', 'Must be an Amrita student email (@am.students.amrita.edu)'),
});

const updateTeamSchema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters'),
  projectTitle: z.string().min(5, 'Project title must be at least 5 characters'),
  members: z.array(teamMemberSchema).min(4, 'Minimum 4 members required').max(6, 'Maximum 6 members allowed'),
  teamLeader: teamLeaderSchema,
});

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Received update request body:', body);

    const validatedData = updateTeamSchema.parse(body);
    console.log('Validated update data:', validatedData);

    // Find the user's team
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the team where the user is the leader
    const team = await prisma.team.findFirst({
      where: { leadId: user.id }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found or you are not the team leader' }, { status: 404 });
    }

    // Store all members including the team leader
    const allMembers = [
      { 
        name: validatedData.teamLeader.name,
        email: validatedData.teamLeader.email,
        rollNumber: validatedData.teamLeader.email.split('@')[0].split('.').pop() || '',
        isLeader: true,
        user: {
          connectOrCreate: {
            where: { email: validatedData.teamLeader.email },
            create: {
              email: validatedData.teamLeader.email,
              name: validatedData.teamLeader.name,
              firstName: validatedData.teamLeader.name.split(' ')[0],
              lastName: validatedData.teamLeader.name.split(' ').slice(1).join(' ') || '',
              password: ''
            }
          }
        }
      },
      ...validatedData.members.map(member => ({
        name: member.name,
        email: member.email,
        rollNumber: member.rollNumber,
        isLeader: false,
        user: {
          connectOrCreate: {
            where: { email: member.email },
            create: {
              email: member.email,
              firstName: member.name.split(' ')[0],
              lastName: member.name.split(' ').slice(1).join(' ') || '',
              password: '', // You might want to set a default password or handle this differently
              name: member.name
            }
          }
        }
      }))
    ];

    // Update the team
    const updatedTeam = await prisma.team.update({
      where: { id: team.id },
      data: {
        teamNumber: validatedData.teamName,
        projectTitle: validatedData.projectTitle,
        members: {
          deleteMany: {},
          create: allMembers
        }
      }
    });

    console.log('Team updated:', updatedTeam);

    return NextResponse.json({
      success: true,
      team: {
        code: updatedTeam.teamNumber,
        name: updatedTeam.teamNumber,
        projectTitle: updatedTeam.projectTitle,
        status: updatedTeam.status,
        members: allMembers
      }
    });
  } catch (error) {
    console.error('Team update error:', error);
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      return NextResponse.json(
        { error: 'Validation error', details: errorDetails },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update team. Please try again.' },
      { status: 500 }
    );
  }
} 