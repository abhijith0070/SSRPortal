import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('SSR12@am161#fail', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@amrita.edu' },
    update: {},
    create: {
      email: 'admin@amrita.edu',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isAdmin: true,
      isStaff: true,
      canLogin: true,
      isRegistered: true,
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });