import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { Parser } from '@json2csv/plainjs';

// Define column mapping for data extraction
const COLUMN_MAPPING: Record<string, { label: string; getValue: (data: any) => string }> = {
  teamNumber: { 
    label: 'Team Number', 
    getValue: (data) => data.team.teamNumber || 'N/A' 
  },
  teamStatus: { 
    label: 'Team Status', 
    getValue: (data) => data.team.status 
  },
  projectTitle: { 
    label: 'Project Title', 
    getValue: (data) => data.team.projectTitle || 'No Title' 
  },
  projectPillar: { 
    label: 'Project Pillar', 
    getValue: (data) => data.team.projectPillar || 'N/A' 
  },
  batch: { 
    label: 'Batch', 
    getValue: (data) => data.team.batch || 'N/A' 
  },
  createdAt: { 
    label: 'Created Date', 
    getValue: (data) => data.team.createdAt.toLocaleDateString() 
  },
  updatedAt: { 
    label: 'Updated Date', 
    getValue: (data) => data.team.updatedAt.toLocaleDateString() 
  },
  
  // Mentor fields
  mentorName: { 
    label: 'Mentor Name', 
    getValue: (data) => data.team.mentor ? `${data.team.mentor.firstName} ${data.team.mentor.lastName}` : 'No Mentor' 
  },
  mentorEmail: { 
    label: 'Mentor Email', 
    getValue: (data) => data.team.mentor?.email || 'N/A' 
  },
  mentorPhone: { 
    label: 'Mentor Phone', 
    getValue: (data) => data.team.mentor?.phone || 'N/A' 
  },
  
  // Lead fields
  leadName: { 
    label: 'Team Lead Name', 
    getValue: (data) => data.team.lead ? `${data.team.lead.firstName} ${data.team.lead.lastName}` : 'No Lead' 
  },
  leadEmail: { 
    label: 'Team Lead Email', 
    getValue: (data) => data.team.lead?.email || 'N/A' 
  },
  leadPhone: { 
    label: 'Team Lead Phone', 
    getValue: (data) => data.team.lead?.phone || 'N/A' 
  },
  
  // Team member fields - Combined
  memberNames: { 
    label: 'Team Members', 
    getValue: (data) => data.members.map((m: any) => m.name).join('; ') || 'No Members' 
  },
  memberEmails: { 
    label: 'Member Emails', 
    getValue: (data) => data.members.map((m: any) => m.email).join('; ') || 'N/A' 
  },
  memberRoles: { 
    label: 'Member Roles', 
    getValue: (data) => data.members.map((m: any) => `${m.name}: ${m.role}`).join('; ') || 'N/A' 
  },
  memberCount: { 
    label: 'Total Members', 
    getValue: (data) => data.members.length.toString() 
  },
  
  // Project fields
  projectDescription: { 
    label: 'Project Description', 
    getValue: (data) => data.team.project?.description || 'No Description' 
  },
  projectName: { 
    label: 'Project Name', 
    getValue: (data) => data.team.project?.name || 'No Project' 
  },
  projectTheme: { 
    label: 'Project Theme', 
    getValue: (data) => data.team.project?.theme?.name || 'No Theme' 
  },
  projectCode: { 
    label: 'Project Code', 
    getValue: (data) => data.team.project?.code || 'N/A' 
  },
  proposalStatus: { 
    label: 'Proposal Status', 
    getValue: (data) => data.team.proposals.length > 0
      ? data.team.proposals.map((p: any) => `${p.title}: ${p.state}`).join('; ')
      : 'No proposals'
  },
  proposalCount: { 
    label: 'Proposal Count', 
    getValue: (data) => data.team.proposals.length.toString() 
  },
  proposalSubmittedAt: { 
    label: 'Latest Proposal Date', 
    getValue: (data) => data.team.proposals.length > 0 
      ? data.team.proposals[data.team.proposals.length - 1].created_at.toLocaleDateString()
      : 'No proposals'
  },
};

export async function POST(request: Request) {
  try {
    const session = await auth();

    // Check if user is authenticated and is an admin
    if (!session?.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get selected columns from request body
    const body = await request.json();
    const selectedColumns: string[] = body.columns || [];

    // Validate that at least one column is selected
    if (selectedColumns.length === 0) {
      return new NextResponse('No columns selected', { status: 400 });
    }

    // Validate all selected columns exist
    const invalidColumns = selectedColumns.filter(col => !COLUMN_MAPPING[col]);
    if (invalidColumns.length > 0) {
      return new NextResponse(`Invalid columns: ${invalidColumns.join(', ')}`, { status: 400 });
    }

    // Fetch all teams with their related data
    const teams = await prisma.team.findMany({
      include: {
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        lead: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
           
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
          },
          orderBy: {
            created_at: 'asc'
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

    // Transform data for CSV with only selected columns
    const csvData = teams.map(team => {
      const teamMembers = membersByTeam[team.id] || [];
      const data = { team, members: teamMembers };
      
      // Build row with only selected columns
      const row: Record<string, string> = {};
      for (const columnId of selectedColumns) {
        const columnConfig = COLUMN_MAPPING[columnId];
        if (columnConfig) {
          row[columnId] = columnConfig.getValue(data);
        }
      }
      
      return row;
    });

    // Build fields configuration for CSV parser
    const fields = selectedColumns.map(columnId => ({
      label: COLUMN_MAPPING[columnId].label,
      value: columnId
    }));

    // Convert to CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(csvData);

    // Create blob and return with proper headers
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `teams_export_${timestamp}.csv`;
    
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', `attachment; filename=${filename}`);
    
    return new NextResponse(csv, { headers });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Keep GET method for backward compatibility
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
            email: true,
          
          }
        },
        lead: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          
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
    const filename = `teams_export_${timestamp}.csv`;
    
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', `attachment; filename=${filename}`);
    
    return new NextResponse(csv, { headers });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}