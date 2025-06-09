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

function determineUserRole(email: string): { role: string; isStaff: boolean; isAdmin: boolean } {
  if (email.endsWith('@amrita.edu')) {
    return { role: 'ADMIN', isStaff: true, isAdmin: true };
  } else if (email.endsWith('@am.amrita.edu')) {
    return { role: 'MENTOR', isStaff: true, isAdmin: false };
  }
  return { role: 'STUDENT', isStaff: false, isAdmin: false };
}

export async function POST(request: Request) {
  console.log('🔍 Registration API called');
  
  try {
    // Test 1: Check if we can parse the request body
    let body;
    try {
      body = await request.json();
      console.log('✅ Request body parsed:', body);
    } catch (error) {
      console.error('❌ Failed to parse request body:', error);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        debug: error?.message 
      }, { status: 400 });
    }

    // Test 2: Check mentor data file
    try {
      console.log('🔍 Checking mentor data structure:', {
        hasmentorData: !!mentorData,
        hasMentorDataArray: !!mentorData?.mentorData,
        mentorCount: mentorData?.mentorData?.length || 0,
        firstMentor: mentorData?.mentorData?.[0] || 'none'
      });
    } catch (error) {
      console.error('❌ Mentor data file issue:', error);
      return NextResponse.json({ 
        error: 'Mentor verification data unavailable',
        debug: error?.message 
      }, { status: 500 });
    }

    // Test 3: Check database connection
    try {
      await prisma.$connect();
      console.log('✅ Database connection successful');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return NextResponse.json({ 
        error: 'Database connection failed',
        debug: error?.message 
      }, { status: 500 });
    }

    // Test 4: Validate mentor registration if applicable
    if (body.email?.endsWith('@am.amrita.edu')) {
      console.log('🔍 Mentor registration detected for:', body.email);
      
      if (!body.secretKey) {
        console.log('❌ Missing secret key for mentor');
        return NextResponse.json({ 
          error: 'Secret key is required for mentor registration' 
        }, { status: 400 });
      }

      const verifiedMentor = verifyMentor(body.email, body.secretKey);
      if (!verifiedMentor) {
        console.log('❌ Mentor verification failed:', {
          email: body.email,
          secretKeyProvided: !!body.secretKey,
          secretKeyLength: body.secretKey?.length || 0
        });
        return NextResponse.json({ 
          error: 'Invalid email or secret key combination' 
        }, { status: 400 });
      }

      console.log('✅ Mentor verified:', verifiedMentor);
      body.firstName = verifiedMentor.first_name;
      body.lastName = verifiedMentor.last_name;
    }

    // Test 5: Validate required fields
    const requiredFields = ['email', 'password', 'firstName', 'lastName'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        received: Object.keys(body)
      }, { status: 400 });
    }

    // Test 6: Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      console.log('❌ Invalid email format:', body.email);
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Test 7: Check for existing user
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: body.email }
      });
      console.log('🔍 Existing user check:', {
        email: body.email,
        exists: !!existingUser
      });
    } catch (error) {
      console.error('❌ Database query failed (findUnique):', error);
      return NextResponse.json({ 
        error: 'Database query failed',
        debug: error?.message 
      }, { status: 500 });
    }

    if (existingUser) {
      console.log('❌ User already exists:', body.email);
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 400 });
    }

    // Test 8: Password hashing
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(body.password, 10);
      console.log('✅ Password hashed successfully');
    } catch (error) {
      console.error('❌ Password hashing failed:', error);
      return NextResponse.json({ 
        error: 'Password processing failed',
        debug: error?.message 
      }, { status: 500 });
    }

    // Test 9: Role determination
    const { role, isStaff, isAdmin } = determineUserRole(body.email);
    console.log('🔍 User role determined:', { role, isStaff, isAdmin });

    // Test 10: User creation
    let user;
    try {
      console.log('🔍 Creating user with data:', {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        role,
        isStaff,
        isAdmin
      });

      user = await prisma.user.create({
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

      console.log('✅ User created successfully:', user.id);
    } catch (error) {
      console.error('❌ User creation failed:', error);
      
      // Check for specific Prisma errors
      if (error?.code === 'P2002') {
        return NextResponse.json({ 
          error: 'A user with this email already exists',
          debug: `Unique constraint failed: ${error?.meta?.target}` 
        }, { status: 400 });
      }

      return NextResponse.json({ 
        error: 'User creation failed',
        debug: error?.message,
        code: error?.code,
        meta: error?.meta
      }, { status: 500 });
    }

    // Success response
    console.log('✅ Registration completed successfully');
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
    console.error('❌ Unexpected error in registration:', error);
    
    return NextResponse.json({ 
      error: 'Registration failed. Please try again later.',
      debug: error?.message,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}