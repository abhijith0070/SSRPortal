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

    // Validate required fields
    if (!data.projectTitle || !data.projectPillar || !data.batch || !data.teamNumber || !data.mentorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!data.members || !Array.isArray(data.members) || data.members.length < 3) {
      return NextResponse.json({ error: 'At least 3 team members required' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Get leader's full data from database
      const leaderUser = await tx.user.findUnique({
        where: { id: session.user.id }
      });

      if (!leaderUser) {
        throw new Error('Team leader not found');
      }

      console.log('🔍 Leader user from database:', {
        id: leaderUser.id,
        email: leaderUser.email,
        rollno: leaderUser.rollno // This should show CH.SC.U4CSE22064
      });

      // First, check if team number already exists
      const existingTeam = await tx.team.findUnique({
        where: { teamNumber: data.teamNumber }
      });

      if (existingTeam) {
        throw new Error('Team number already exists');
      }

      // Check if user already has a team
      const existingUserTeam = await tx.team.findFirst({
        where: { leadId: session.user.id }
      });

      if (existingUserTeam) {
        throw new Error('You already have a team');
      }

      // Create or find users for team members first
      const memberUsers = await Promise.all(
        data.members.map(async (member: any) => {
          // Check if user already exists
          let user = await tx.user.findUnique({
            where: { email: member.email }
          });

          if (!user) {
            // Create new user if doesn't exist
            const nameParts = member.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            user = await tx.user.create({
              data: {
                firstName,
                lastName,
                email: member.email,
                password: '', // Temporary password - should be handled by auth system
                rollno: member.rollNumber,
                isRegistered: false,
                canLogin: false
              }
            });
          }

          return {
            user,
            memberData: member
          };
        })
      );

      // Create the team
      const team = await tx.team.create({
        data: {
          projectTitle: data.projectTitle,
          projectPillar: data.projectPillar,
          status: 'PENDING',
          batch: data.batch,
          teamNumber: data.teamNumber,
          leadId: session.user.id,
          mentorId: data.mentorId
        }
      });

      // Create team members using database data
      const teamMembers = await Promise.all([
        // Create leader member entry using DATABASE data
        tx.teamMember.create({
          data: {
            teamId: team.id,
            userId: leaderUser.id,
            name: `${leaderUser.firstName} ${leaderUser.lastName}`,
            email: leaderUser.email,
            rollNumber: leaderUser.rollno || '', // Use database rollno, not session
            role: 'LEADER'
          }
        }),
        // Create other team member entries
        ...memberUsers.map(({ user, memberData }) =>
          tx.teamMember.create({
            data: {
              teamId: team.id,
              userId: user.id,
              name: memberData.name,
              email: memberData.email,
              rollNumber: memberData.rollNumber,
              role: 'MEMBER'
            }
          })
        )
      ]);

      return {
        team,
        members: teamMembers
      };
    }, {
      maxWait: 10000, // 10 seconds
      timeout: 15000, // 15 seconds
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Error in team creation:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      if (target?.includes('teamNumber')) {
        return NextResponse.json(
          { error: 'Team number already exists' },
          { status: 409 }
        );
      }
      if (target?.includes('email')) {
        return NextResponse.json(
          { error: 'A user with this email already exists in another team' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Duplicate entry detected' },
        { status: 409 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Referenced record not found (mentor may not exist)' },
        { status: 404 }
      );
    }

    // Handle transaction timeout
    if (error.message?.includes('Transaction')) {
      return NextResponse.json(
        { error: 'Request timeout. Please try again.' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create team' },
      { status: 500 }
    );
  }
}