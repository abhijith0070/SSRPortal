import { AuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '@/lib/db/prisma';

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/auth/student/signin',
    error: '/auth/student/signin',
    signOut: '/auth/student/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email@am.amrita.edu',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
        role: { // Add role to credentials
          label: 'Role',
          type: 'text',
        }
      },
      async authorize(credentials) {
        console.log('Attempting to authorize with credentials:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('Please provide both email and password');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        console.log('Found user:', user ? 'Yes' : 'No');

        if(!user) {
          console.log('User not found');
          throw new Error('Email or password is not correct');
        }

        if(!credentials.password) {
          console.log('Password missing');
          throw new Error('Please provide your password');
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        console.log('Password check result:', isPasswordCorrect ? 'Correct' : 'Incorrect');

        if(!isPasswordCorrect) {
          console.log('Password incorrect');
          throw new Error('Email or password is not correct');
        }

        // Handle role-specific validation
        if (credentials.role === 'mentor' && user.role !== 'MENTOR') {
          console.log('Not a mentor account');
          throw new Error('This login is only for mentors');
        } else if (credentials.role === 'student' && user.role !== 'STUDENT') {
          console.log('Not a student account');
          throw new Error('This login is only for students');
        }

        if(!user.canLogin) {
          console.log('User cannot login');
          throw new Error('Your account is not authorized to login');
        }

        console.log('Authorization successful');
        const { password: _, ...userWithoutPass } = user;
        return userWithoutPass;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if(user) token.user = user as User;
      return token;
    },

    async session({ session, token }) {
      const user = token.user as User;
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          isStaff: user.isStaff,
          isAdmin: user.isAdmin,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
    },

    async redirect({ url, baseUrl }) {
      const token = await (authOptions.callbacks as any).jwt({ token: {} });
      const role = token?.user?.role?.toLowerCase();

      // Define dashboard routes based on role
      const dashboardRoutes = {
        student: '/dashboard/student',
        mentor: '/dashboard/mentor',
        admin: '/dashboard/admin'
      };

      // If coming from signin
      if (url.startsWith('/auth/signin') || url === baseUrl) {
        return `${baseUrl}${dashboardRoutes[role] || '/auth/signin'}`;
      }

      // Handle other URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // Default to role-specific dashboard
      return `${baseUrl}${dashboardRoutes[role] || '/auth/signin'}`;
    }
  },
};

export function auth(...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, authOptions);
}

export default auth;