import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import RegisterForm from './form';

const RegisterPage = async () => {
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect('/dashboard');
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
