import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

import auth from '@auth';

// Prisma client instance
const prisma = new PrismaClient();

// Validation schema for team-mentor import
const TeamMentorImportSchema = z.object({
  teamID: z.string().min(1, 'Team ID is required'),
  email: z.string().email('Invalid mentor email format'),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || !user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json();

    // Validate input using Zod
    const teamMentorAssignments = z.array(TeamMentorImportSchema).parse(body);

    // Start a transaction to ensure data integrity
    const updatedTeams = [];
    const existingTeams = [];

    // Fetch all existing teams and mentors in one query
    const [existingTeamsData, existingMentors] = await Promise.all([
      prisma.team.findMany({
        where: {
          code: { in: teamMentorAssignments.map((assignment) => assignment.teamID) },
        },
        select: { code: true },
      }),
      prisma.user.findMany({
        where: {
          email: { in: teamMentorAssignments.map((assignment) => assignment.email) },
        },
        select: { email: true, id: true },
      })
    ]);

    // Teams that doesn't exist in the database
    // @TODO: Add a check to ensure that the team ID is valid

    // Mentors that doesn't exist in the database
    // @TODO: Add a check to ensure that the mentor email is valid


    const existingTeamIds = new Set(existingTeamsData.map((team) => team.code));

    // Update teams with mentors
    for (const assignment of teamMentorAssignments) {

      const team = Array.from(existingTeamIds).find((teamID) => teamID === assignment.teamID);
      const mentor = existingMentors.find((mentor) => mentor.email === assignment.email);
      if (mentor && team) {
        const updatedTeam = await prisma.team.update({
          where: { code: team },
          data: {
            mentorId: mentor.id,
          },
        });

        updatedTeams.push(updatedTeam);
      }
    }

    // Identify existing teams that were not updated because they didn't match valid assignments
    // existingTeams.push(
    //     ...teamMentorAssignments.filter((assignment) => {
    //       return !existingTeamIds.has(assignment.teamID) || !existingMentorEmails.has(assignment.email);
    //     }).map((assignment) => ({
    //       teamID: assignment.teamID,
    //       mentorEmail: assignment.email,
    //       reason: 'Invalid team ID or mentor email',
    //     }))
    // );

    // Return the results
    const importResult = { updatedTeams, existingTeams };

    return new Response(JSON.stringify({
      message: 'Team-Mentor import process completed',
      updated: importResult.updatedTeams.length,
      existing: importResult.existingTeams.length,
      updatedTeams: importResult.updatedTeams,
      existingTeams: importResult.existingTeams,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Handle different types of errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({
        message: 'Validation Error',
        errors: error.errors,
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (error instanceof Error) {
      return new Response(JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      message: 'Unknown Error',
      error: String(error),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
