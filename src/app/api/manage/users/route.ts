import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/db/prisma';
import { auth } from '@auth';

export const GET = async (req: NextRequest) => {

  const session = await auth();
  if(!session?.user?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const limit = 20;
  const cursor = req.nextUrl.searchParams.get('cursor') as string ?? '';
  const cursorObj = cursor === '' ? undefined : { id: parseInt(cursor as string, 10) };
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      isAdmin: true,
      isStaff: true,
      isRegistered: true,
      canLogin: true,
      email: true,
      firstName: true,
      lastName: true,
      team: true,
    },
    skip: cursor !== '' ? 1 : 0,
    //   @ts-ignore
    cursor: cursorObj,
    take: limit,
  });
  return NextResponse.json({ users, nextId: users.length === limit ? users[limit - 1].id : undefined });
};
