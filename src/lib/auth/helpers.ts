import { signIn as nextAuthSignIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export const handleStudentSignIn = async (email: string, password: string) => {
  return await nextAuthSignIn('credentials', {
    email,
    password,
    loginType: 'student',
    callbackUrl: '/dashboard/student',
    redirect: false
  });
};

export const handleCombinedSignIn = async (email: string, password: string) => {
  const router = useRouter();
  const result = await nextAuthSignIn('credentials', {
    email,
    password,
    loginType: 'combined',
    redirect: false
  });
  
  if (result?.ok) {
    const session = await getSession();
    if (session?.user?.role === 'MENTOR') {
      router.push('/dashboard/mentor');
    } else if (session?.user?.role === 'ADMIN') {
      router.push('/dashboard/admin');
    }
  }
  return result;
};

export type SignupFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const handleMentorSignup = async (formData: SignupFormData) => {
  const router = useRouter();
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...formData, role: 'MENTOR' }),
  });

  if (!res.ok) throw new Error('Registration failed');
  router.push('/auth/signin');
};