'use server';

import { Project } from '@prisma/client';
import { notFound } from 'next/navigation';

import prisma from '@/lib/db/prisma';
import auth from '@auth';

type TError = {
  error: any;
  statusCode: number;
    
};



export async function getProject(code: string) : Promise<Project | TError> {
  try {
    const project = await prisma.project.findUnique({
      where: { code },
      include: {
        Team: {
          include: {
            mentor: true,
          }
        },
        theme: true,
      },
    }).then(r => r);

    if(!project?.isAccepted) {
      const session = await auth();
      const user = session?.user;

      if(!user || !user?.isStaff) {
        notFound();
      }
    }
    
    if(!project) notFound();
    return project;
  } catch (e) {
    console.error(e);
    notFound();
  }
}

export async function getProjectByID(id: string) : Promise<Project | TError> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id), isAccepted: true },
      include: {
        Team: {
          include: {
            mentor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
    if(!project) notFound();
    return project;
  } catch (e) {
    console.error(e);
    notFound();
  }
}