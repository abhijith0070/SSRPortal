import { promises as fs } from 'fs';

import brcypt from 'bcryptjs';

import { THEMES } from './theme';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getMasterData() {
  const file = await fs.readFile(process.cwd() + '/src/lib/db/master.json', 'utf8');
  const data = JSON.parse(file);
  
  return data;
}

const load = async () => {
  try {


    if(!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)
      throw new Error('Admin email or password not set');

    await prisma.theme.deleteMany();
    
    await prisma.theme.createMany({
      data: THEMES.map((theme) => ({ name: theme.label, id: theme.id })),
    });

    // eslint-disable-next-line no-console
    console.log('Added themes data');


    const DATA = await getMasterData();

    await prisma.team.deleteMany();

    await prisma.team.createMany({
      data: Object.keys(DATA).map((key: string) => (
        {
          code: key,
          members: DATA[key].members,
        }
      )),
    });
    
    // eslint-disable-next-line no-console
    console.log('Added teams data');

    await prisma.project.deleteMany();

    const allTeams = await prisma.team.findMany({
      select: { code: true },
    }).then((teams) => {
      return teams.map((team) => team.code);
    }).catch(e => console.error(e));
    
    const admin = await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL as string },
      update: {}, // optionally update fields if needed
      create: {
        isStaff: true,
        isAdmin: true,
        emailVerified: new Date(),
        email: process.env.ADMIN_EMAIL as string,
        password: await brcypt.hash(process.env.ADMIN_PASSWORD as string, 10),
        firstName: 'SSR',
        lastName: 'Admin',
        canLogin: true,
      },
    });
    

    for(const key of allTeams as string[]) {
      await prisma.project.create({
        data: {
          name: DATA[key].title,
          code: key,

          link: DATA[key].folder_url,
          meta: {
            year: key.substring(3, 7),
            date: DATA[key].date,
            
            place: DATA[key].place,
            district: DATA[key].district,
            state: DATA[key].state,

            mentor: DATA[key].mentor,
          },

          isAccepted: true,
        },
      });
    }
    
    // eslint-disable-next-line no-console
    console.log('Added projects data');

  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};


