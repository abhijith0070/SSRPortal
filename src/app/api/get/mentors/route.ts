import { NextResponse } from 'next/server';

import prisma from '@/lib/db/prisma';
import { auth } from '@auth';

export async function GET() {
  
  const session = await auth();
  const user = session?.user;
  
  if(!user || !user?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const mentors = await prisma.user.findMany({
    where: {
      isStaff: true,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      image: true,
    },
  });

  const sruthi = await prisma.user.findFirst({
    where: { firstName: "Sruthi", lastName: "B", role: "MENTOR" }
  });

  return NextResponse.json(mentors || []);
}