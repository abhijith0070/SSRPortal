import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch team data for the student - check both as team lead and team member
    let team = await prisma.team.findFirst({
      where: {
        leadId: session.user.id
      },
      select: {
        id: true,
        projectTitle: true,
        projectPillar: true,  // Include project pillar for proposal category auto-fill
        status: true,
        teamNumber: true,
        batch: true,
        members: true,
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        mentor: {
          select: {
            id: true,
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
          orderBy: {
            updated_at: 'desc'
          },
          select: {
            id: true,
            title: true,
            description: true,
            state: true,
            created_at: true,
            updated_at: true
          }
        }
      }
    });

    // If not found as team lead, check as team member
    if (!team) {
      const teamMember = await prisma.teamMember.findFirst({
        where: {
          userId: session.user.id
        },
        include: {
          team: {
            select: {
              id: true,
              projectTitle: true,
              projectPillar: true,  // Include project pillar for proposal category auto-fill
              status: true,
              teamNumber: true,
              batch: true,
              members: true,
              lead: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              },
              mentor: {
                select: {
                  id: true,
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
                orderBy: {
                  updated_at: 'desc'
                },
                select: {
                  id: true,
                  title: true,
                  description: true,
                  state: true,
                  created_at: true,
                  updated_at: true
                }
              }
            }
          }
        }
      });
      
      team = teamMember?.team || null;
    }

    if (!team) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 });
    }

    // Format the response with stats
    const response = {
      success: true,
      team: {
        ...team,
        stats: {
          proposals: team.proposals.length,
          members: team.members ? team.members.length : 0,
          status: team.project ? 'PROPOSAL_ACCEPTED' : 'PROPOSAL_SUBMISSION'
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching team data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 