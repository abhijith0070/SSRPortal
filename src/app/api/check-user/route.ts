import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // Ensure email ends with correct domain
    if (!email.endsWith('@am.students.amrita.edu')) {
      return NextResponse.json({ 
        error: 'Invalid email domain. Must end with @am.students.amrita.edu' 
      }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isRegistered: true,
        canLogin: true
      }
    });

    if (!user) {
      // Extract roll number from email
      const rollNumber = email.split('@')[0].split('.').pop();
      
      // If user doesn't exist, create one
      const newUser = await prisma.user.create({
        data: {
          email: email,
          firstName: rollNumber || '',  // Use roll number as first name
          lastName: '',
          role: 'STUDENT',
          isRegistered: true,
          canLogin: true,
          password: '' // You might want to set this properly
        }
      });

      return NextResponse.json({
        message: 'User created',
        user: newUser
      });
    }

    return NextResponse.json({
      message: 'User found',
      user: user
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to check user' }, { status: 500 });
  }
} 