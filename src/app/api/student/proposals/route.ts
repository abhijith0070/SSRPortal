import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { proposalSchema } from '@/lib/validation/proposal';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = proposalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed' }, { status: 400 });
    }

    // find user's team
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { team: true },
    });

    if (!user?.team) {
      return NextResponse.json({
        success: false,
        error: 'Team not found',
        message: 'You must be part of a team to submit a proposal',
      }, { status: 404 });
    }

    const p = await prisma.proposal.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        content: parsed.data.content,
        attachment: parsed.data.attachment,
        link: parsed.data.link,
        state: 'DRAFT',
        Team: { connect: { id: user.team.id } },
        author: { connect: { id: session.user.id } },
        updated_at: new Date(),
      },
      include: {
        author: { select: { firstName: true, lastName: true, email: true } },
        Team: { include: { mentor: { select: { email: true } } } },
      },
    });

    return NextResponse.json({ success: true, data: p }, { status: 201 });
  } catch (e) {
    console.error('Error creating proposal:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { team: true },
    });

    if (!user?.team) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 });
    }

    // IMPORTANT: filter by relation properly
    const proposals = await prisma.proposal.findMany({
      where: { teamCode: user.team.id },              // ✅ correct filter
      orderBy: { updated_at: 'desc' },
      include: { author: { select: { firstName: true, lastName: true, email: true } } },
    });

    return NextResponse.json({ success: true, data: proposals });
  } catch (e) {
    console.error('Error fetching proposals:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
