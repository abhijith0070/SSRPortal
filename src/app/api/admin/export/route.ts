import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Parser } from '@json2csv/plainjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch all teams with their related data
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: {
            user: true
          }
        },
        mentor: true,
        proposals: true,
        project: true,
      }
    });

    // Transform data for CSV
    const csvData = teams.map(team => ({
      teamCode: team.code,
      teamStatus: team.status,
      mentorName: team.mentor.name,
      mentorEmail: team.mentor.email,
      memberCount: team.members.length,
      members: team.members.map(m => m.user.name).join('; '),
      memberEmails: team.members.map(m => m.user.email).join('; '),
      proposalCount: team.proposals.length,
      latestProposalStatus: team.proposals[team.proposals.length - 1]?.status || 'NO_PROPOSAL',
      projectTitle: team.project?.title || 'No Project',
      projectDescription: team.project?.description || 'No Description',
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
    }));

    // Convert to CSV
    const parser = new Parser({
      fields: [
        'teamCode',
        'teamStatus',
        'mentorName',
        'mentorEmail',
        'memberCount',
        'members',
        'memberEmails',
        'proposalCount',
        'latestProposalStatus',
        'projectTitle',
        'projectDescription',
        'createdAt',
        'updatedAt'
      ]
    });
    const csv = parser.parse(csvData);

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=teams-export.csv'
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 