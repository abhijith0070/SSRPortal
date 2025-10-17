import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const proposalId = parseInt(params.id);
    const { state, remarks } = await req.json();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is a mentor and verify they are assigned to the team
    const mentor = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { mentees: true }
    });

    if (!mentor || mentor.role !== "MENTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the proposal to check if the mentor is assigned to the team
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { Team: true }
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Check if this mentor is assigned to the team that owns the proposal
    const isAssignedMentor = mentor.mentees.some(team => team.id === proposal.teamCode);
    
    if (!isAssignedMentor) {
      return NextResponse.json({ 
        error: "You are not authorized to review this proposal" 
      }, { status: 403 });
    }

    // Validate the state value
    if (state !== "APPROVED" && state !== "REJECTED") {
      return NextResponse.json(
        { error: "Invalid state value" },
        { status: 400 }
      );
    }

    // Update the proposal status with remarks
    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: { 
        state,
        remarks: remarks || (state === "APPROVED" ? "Proposal approved" : "Proposal needs revision"),
        remark_updated_at: new Date()
      },
    });

    return NextResponse.json({
      message: `Proposal ${state.toLowerCase()} successfully`,
      data: updatedProposal,
    });
  } catch (error) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      { error: "Failed to update proposal" },
      { status: 500 }
    );
  }
}
