import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { Parser } from '@json2csv/plainjs';

export async function GET() {
  try {
    const session = await auth();

    // Check if user is authenticated and is an admin
    if (!session?.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch all teams with their related data (matching admin teams route)
    const teams = await prisma.team.findMany({
      include: {
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        lead: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        project: {
          include: {
            theme: true
          }
        },
        proposals: {
          select: {
            title: true,
            state: true,
            created_at: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get members for all teams from TeamMember table
    const allTeamIds = teams.map(team => team.id);
    const allMembers = await prisma.teamMember.findMany({
      where: {
        teamId: { in: allTeamIds }
      },
      select: {
        id: true,
        teamId: true,
        name: true,
        email: true,
        role: true
      }
    });

    // Group members by teamId
    const membersByTeam: Record<string, typeof allMembers> = {};
    for (const member of allMembers) {
      if (!membersByTeam[member.teamId]) {
        membersByTeam[member.teamId] = [];
      }
      membersByTeam[member.teamId].push(member);
    }

    // Transform data for CSV
    const csvData = teams.map(team => {
      const teamMembers = membersByTeam[team.id] || [];
      
      return {
        teamNumber: team.teamNumber || 'N/A',
        teamStatus: team.status,
        projectTitle: team.projectTitle || 'No Title',
        projectPillar: team.projectPillar || 'N/A',
        batch: team.batch || 'N/A',
        // Mentor information
        mentorName: team.mentor ? `${team.mentor.firstName} ${team.mentor.lastName}` : 'No Mentor',
        mentorEmail: team.mentor?.email || 'N/A',
        // Lead information
        leadName: team.lead ? `${team.lead.firstName} ${team.lead.lastName}` : 'No Lead',
        leadEmail: team.lead?.email || 'N/A',
        // Team members
        memberCount: teamMembers.length,
        members: teamMembers
          .map(m => m.name)
          .join('; ') || 'No Members',
        memberEmails: teamMembers
          .map(m => m.email)
          .join('; ') || 'N/A',
        memberRoles: teamMembers
          .map(m => `${m.name}: ${m.role}`)
          .join('; ') || 'N/A',
        // Proposal information
        proposalCount: team.proposals.length,
        proposalStatus: team.proposals.length > 0
          ? team.proposals.map(p => `${p.title}: ${p.state}`).join('; ')
          : 'No proposals',
        latestProposalDate: team.proposals.length > 0 
          ? team.proposals[team.proposals.length - 1].created_at.toLocaleDateString()
          : 'No proposals',
        // Project information
        projectName: team.project?.name || 'No Project',
        projectTheme: team.project?.theme?.name || 'No Theme',
        projectDescription: team.project?.description || 'No Description',
        projectCode: team.project?.code || 'N/A',
        // Timestamps
        createdAt: team.createdAt.toLocaleDateString(),
        updatedAt: team.updatedAt.toLocaleDateString(),
      };
    });

    // Convert to CSV with expanded fields
    const parser = new Parser({
      fields: [
        { label: 'Team Number', value: 'teamNumber' },
        { label: 'Team Status', value: 'teamStatus' },
        { label: 'Project Title', value: 'projectTitle' },
        { label: 'Project Pillar', value: 'projectPillar' },
        { label: 'Batch', value: 'batch' },
        { label: 'Mentor Name', value: 'mentorName' },
        { label: 'Mentor Email', value: 'mentorEmail' },
        { label: 'Lead Name', value: 'leadName' },
        { label: 'Lead Email', value: 'leadEmail' },
        { label: 'Member Count', value: 'memberCount' },
        { label: 'Members', value: 'members' },
        { label: 'Member Emails', value: 'memberEmails' },
        { label: 'Member Roles', value: 'memberRoles' },
        { label: 'Proposal Count', value: 'proposalCount' },
        { label: 'Proposal Status', value: 'proposalStatus' },
        { label: 'Latest Proposal Date', value: 'latestProposalDate' },
        { label: 'Project Name', value: 'projectName' },
        { label: 'Project Theme', value: 'projectTheme' },
        { label: 'Project Description', value: 'projectDescription' },
        { label: 'Project Code', value: 'projectCode' },
        { label: 'Created At', value: 'createdAt' },
        { label: 'Updated At', value: 'updatedAt' }
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