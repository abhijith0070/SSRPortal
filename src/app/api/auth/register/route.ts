import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import mentorData from '@/data/verifymentor.json';

interface MentorVerification {
  first_name: string;
  last_name: string;
  email: string;
  secret_id: string;
}

function verifyMentor(email: string, secretKey: string): MentorVerification | null {
  return mentorData.mentorData.find(
    (m: MentorVerification) => m.email === email && m.secret_id === secretKey
  ) || null;
}

// Add role determination helper function
function determineUserRole(email: string): { role: string; isStaff: boolean; isAdmin: boolean } {
  if (email.endsWith('@amrita.edu')) {
    return { role: 'ADMIN', isStaff: true, isAdmin: true };
  } else if (email.endsWith('@am.amrita.edu')) {
    return { role: 'MENTOR', isStaff: true, isAdmin: false };
  }
  return { role: 'STUDENT', isStaff: false, isAdmin: false };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Registration request body:', body);

    // Check if it's a mentor registration
    if (body.email?.endsWith('@am.amrita.edu')) {
      if (!body.secretKey) {
        return NextResponse.json({ 
          error: 'Secret key is required for mentor registration' 
        }, { status: 400 });
      }

      const verifiedMentor = verifyMentor(body.email, body.secretKey);
      if (!verifiedMentor) {
        return NextResponse.json({ 
          error: 'Invalid email or secret key combination' 
        }, { status: 400 });
      }

      // Use the verified mentor's name directly
      body.firstName = verifiedMentor.first_name;
      body.lastName = verifiedMentor.last_name;
    }

    // Validate required fields
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      const missingFields = [];
      if (!body.email) missingFields.push('email');
      if (!body.password) missingFields.push('password');
      if (!body.firstName) missingFields.push('firstName');
      if (!body.lastName) missingFields.push('lastName');
      
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Determine role and permissions based on email domain
    const { role, isStaff, isAdmin } = determineUserRole(body.email);

    // Create user with determined role
    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        role: role,
        isRegistered: true,
        canLogin: true,
        isAdmin: isAdmin,
        isStaff: isStaff,
        emailVerified: new Date(),
      },
    });

    // Return success response
    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle Prisma-specific errors
    if (error?.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A user with this email already exists' 
      }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({ 
      error: 'Registration failed. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    }, { status: 500 });
  }
}