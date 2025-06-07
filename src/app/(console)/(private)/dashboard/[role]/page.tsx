'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import StudentDashboard from '../student/page';
import MentorDashboard from '../mentor/page';
import AdminDashboard from '../admin/page';
import { notFound } from 'next/navigation';

export default function RoleDashboard({
  params,
}: {
  params: { role: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const userRole = session.user?.role?.toLowerCase();
    if (userRole && userRole !== params.role.replace('_', '')) {
      router.push(`/dashboard/_${userRole}`);
    }
  }, [session, status, router, params.role]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Render the appropriate dashboard based on role
  switch (params.role) {
    case '_student':
      return <StudentDashboard />;
    case '_mentor':
      return <MentorDashboard />;
    case '_admin':
      return <AdminDashboard />;
    default:
      return notFound();
  }
} 