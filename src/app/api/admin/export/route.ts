import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Parser } from '@json2csv/plainjs';

export async function GET() {
  try {
    const session = await auth();

    // Check if user is authenticated and is an admin
    if (session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch all teams with their related data
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true
              }
            }
          }
        },
        mentor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        },
        proposals: {
          select: {
            title: true,
            state: true,
            created_at: true
          }
        },
        project: {
          include: {
            theme: true
          }
        }
      }
    });

    // Transform data for CSV
    const csvData = teams.map(team => ({
      teamNumber: team.teamNumber,
      teamStatus: team.status,
      // Mentor information
      mentorName: `${team.mentor.firstName} ${team.mentor.lastName}`,
      mentorEmail: team.mentor.email,
      // Team members
      memberCount: team.members.length,
      members: team.members
        .map(m => `${m.user.firstName} ${m.user.lastName}`)
        .join('; '),
      memberEmails: team.members
        .map(m => m.user.email)
        .join('; '),
      // Proposal information
      proposalCount: team.proposals.length,
      proposalStatus: team.proposals
        .map(p => `${p.title}: ${p.state}`)
        .join('; '),
      latestProposalDate: team.proposals.length > 0 
        ? team.proposals[team.proposals.length - 1].created_at.toLocaleDateString()
        : 'No proposals',
      // Project information
      projectTitle: team.project?.name || 'No Project',
      projectTheme: team.project?.theme?.name || 'No Theme',
      projectDescription: team.project?.description || 'No Description',
      // Timestamps
      createdAt: team.createdAt.toLocaleDateString(),
      updatedAt: team.updatedAt.toLocaleDateString(),
    }));

    // Convert to CSV with expanded fields
    const parser = new Parser({
      fields: [
        'teamNumber',
        'teamStatus',
        'mentorName',
        'mentorEmail',
        'memberCount',
        'members',
        'memberEmails',
        'proposalCount',
        'proposalStatus',
        'latestProposalDate',
        'projectTitle',
        'projectTheme',
        'projectDescription',
        'createdAt',
        'updatedAt'
      ]
    });
    
    const csv = parser.parse(csvData);

    // Return CSV file with timestamp in filename
    const timestamp = new Date().toISOString().split('T')[0];
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=teams-export-${timestamp}.csv`
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}