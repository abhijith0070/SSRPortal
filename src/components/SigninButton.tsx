'use client';

import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Button from '@/components/button';

const SignInButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    // Redirect to role-specific signin page
    if (session?.user?.role === 'STUDENT') {
      router.push('/auth/student/signin');
    } else {
      router.push('/auth/signin');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {session && session.user ? (
        <>
          <Link 
            href="/profile" 
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <span className="font-medium">
              {`${session.user.firstName} ${session.user.lastName}`}
            </span>
            <span className="text-sm text-gray-500">
              ({session.user.role})
            </span>
          </Link>
          <Link
            className="text-red-500 hover:text-red-600 transition-colors"
            href="/api/auth/signout"
          >
            Sign Out
          </Link>
        </>
      ) : (
        <>
          <Button 
            onClick={handleSignIn}
            className="flex items-center gap-2"
          >
            Sign In
          </Button>
          <Button 
            link="/auth/signup"
            variant="secondary"
            className="flex items-center gap-2"
          >
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
};

export default SignInButton;
