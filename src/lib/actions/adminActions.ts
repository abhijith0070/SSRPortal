'use server';


import { Prisma } from '@prisma/client';

import prisma from '@/lib/db/prisma';
import { auth } from '@auth';

export type TError = {
  error: any;
  status: number;

};



export async function addTeam(teamCode:string, mentorID:string) {

  const session = await auth();
  const user = session?.user;

  if(!user || !user?.isAdmin) return { error: 'Unauthorized', status: 401 };
  
  try {
    const team = await prisma.team.create({
      data: {
        code: teamCode,
        mentorId: mentorID || user?.id,
        members: [],
      },
    });
    return { code: team?.code };
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError) {
      if(error.code === 'P2002') {
        return { error: 'Team code already exists', status: 400 } as TError;
      }
    }
    return { error: JSON.stringify(error), status: 500 };
  }
}

export const getMentors = async () => {
  return prisma.user.findMany({
    where: {
      isStaff: true,
    },
  });
};