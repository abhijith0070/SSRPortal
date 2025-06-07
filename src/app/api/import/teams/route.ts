import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

import auth from '@auth';

// Prisma client instance
const prisma = new PrismaClient();

// Validation schema for team import
const TeamImportSchema = z.object({
  code: z.string().min(1, 'Team code is required'),
  mentorId: z.string().optional(),
  members: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).min(1, 'At least one member is required'),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;

    if(!user || !user?.isAdmin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const body = await req.json();

    // Validate input using Zod
    const teams = z.array(TeamImportSchema).parse(body);

    // Start a transaction to ensure data integrity
    const importedTeams = [];
    const existingTeams = [];

    // Fetch all existing team codes in one query
    const existingTeamCodes = new Set(
      (await prisma.team.findMany({
        where: {
          code: { in: teams.map((t) => t.code) },
        },
        select: { code: true },
      })).map((t) => t.code),
    );

    // Filter teams to create
    const teamsToCreate = teams.filter(
      (teamData) => !existingTeamCodes.has(teamData.code),
    );

    // Create teams in bulk
    if(teamsToCreate.length > 0) {
      const createdTeams = await prisma.team.createMany({
        data: teamsToCreate.map((teamData) => ({
          code: teamData.code,
          members: teamData.members as any,
        })),
        skipDuplicates: true, // Ensures duplicates are skipped
      }).then(r => r);

      importedTeams.push(createdTeams);
    }

    // Add existing teams to the result
    existingTeams.push(
      ...teams
        .filter((teamData) => existingTeamCodes.has(teamData.code))
        .map((teamData) => ({
          code: teamData.code,
          reason: 'Team already exists',
        })),
    );

    // Return the results
    const importResult = { importedTeams, existingTeams };


    return new Response(JSON.stringify({
      message: 'Team import process completed',
      imported: importResult.importedTeams.length,
      existing: importResult.existingTeams.length,
      importedTeams: importResult.importedTeams,
      existingTeams: importResult.existingTeams,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Team import error:', error);

    // Handle different types of errors
    if(error instanceof z.ZodError) {
      return new Response(JSON.stringify({
        message: 'Validation Error',
        errors: error.errors,
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if(error instanceof Error) {
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