import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

export const GET = async (req: NextRequest) => {
  const limit = 20;
  const cursor = req.nextUrl.searchParams.get('cursor') as string ?? '';
  const query = req.nextUrl.searchParams.get('query') as string ?? '';
  const cursorObj = cursor === '' ? undefined : { id: parseInt(cursor as string, 10) };

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
          },
        },
        {
          code: {
            contains: query,
          },
        },
      ],
    },
    include: { theme: true },
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        id: 'desc',
      },
    ],
    cursor: cursorObj,
    take: limit,
  });

  return NextResponse.json({
    projects,
    nextId: projects.length === limit ? projects[limit - 1].id : undefined
  });
};
