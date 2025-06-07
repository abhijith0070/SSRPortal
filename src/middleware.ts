import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow public access to auth routes
    if (path.startsWith('/auth/')) {
      return null; // Allow access to auth routes without redirection
    }

    // Protected routes
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    const role = token.user?.role?.toLowerCase();
    
    // Role-based access control
    if (path.includes('/student') && role !== 'student') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
          }
    if (path.includes('/mentor') && role !== 'mentor') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }
    if (path.includes('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Allow access to auth routes without requiring authorization
        if (path.startsWith('/auth/')) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};