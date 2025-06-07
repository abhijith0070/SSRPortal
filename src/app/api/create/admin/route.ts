import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';


import auth from '@auth';


// Prisma client instance
const prisma = new PrismaClient();

// Validation schema for team import
const CreateAdminSchema = z.object({
  firstname: z.string(),
  lastname: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user;

  if(!user || !user?.isAdmin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    
  try {
    const body = await req.json();

    // Validate input using Zod
    const user = CreateAdminSchema.parse(body);
        
    // Create admin
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const res = await prisma.user.create({
      data: {
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        password: user.password ? hashedPassword : '',
        isStaff: true,
        isAdmin: true,
        isRegistered: true,
        canLogin: true,
      },
    }).then((res) => res);
    return new Response(JSON.stringify({ id: res?.id }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Something went wrong', details: error }), { status: 500 });
  }
}