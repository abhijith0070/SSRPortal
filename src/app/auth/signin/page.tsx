import { redirect } from 'next/navigation';
import LoginForm from './form';
import { auth } from '@/lib/auth';

interface PageProps {
  searchParams: {
    callback?: string;
    error?: string;
  };
}

const LoginPage = async ({ searchParams }: PageProps) => {
  const session = await auth();

  // Redirect if user is already authenticated
  if (session?.user?.id) {
    // Always redirect students to student dashboard
    const redirectPath = '/dashboard/mentor';
    redirect(redirectPath);
  }

  // Extract searchParams values
  const callbackUrl = '/dashboard/mentor'; // Force callback to student dashboard
  const errorMessage = searchParams?.error || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Mentor Sign In
          </h2>
          {errorMessage && (
            <div className="mt-2 text-center text-sm text-red-600">
              {errorMessage}
            </div>
          )}
        </div>
        <LoginForm callback={callbackUrl} error={errorMessage} />
      </div>
    </div>
  );
};

export default LoginPage;
