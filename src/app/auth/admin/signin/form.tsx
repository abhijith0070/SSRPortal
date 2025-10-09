'use client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { z } from 'zod';
import Button from '@/components/button';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

interface Props {
  callback?: string;
  error?: string;
}

const FormSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string({
    required_error: 'Please enter your password',
  }).min(6, 'Password must be at least 6 characters'),
});

type InputType = z.infer<typeof FormSchema>;

const LoginForm = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    try {
      setIsLoading(true);
      console.log('Attempting admin login with:', data.email);
      
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        role: 'admin', // Pass role to identify admin login
        redirect: false, // Handle redirect manually
      });

      console.log('Sign in result:', result);

      if (result?.error) {
        console.error('Sign in error:', result.error);
        toast.error(result.error);
        return;
      }

      if (result?.ok) {
        toast.success('Welcome to SSR Portal Admin!');
        router.push('/dashboard/admin');
        router.refresh();
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md min-w-[330px] md:min-w-[400px] xl:p-0 shadow-lg border">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight text-left tracking-tight text-gray-900 md:text-2xl">
          Admin Login
        </h1>
        <form
          className="space-y-4 md:space-y-8 mt-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="p-2 flex flex-col gap-4">
            <div className="flex flex-col items-start">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                aria-errormessage={errors.email?.message}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="admin@amrita.edu"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="password" className="block mb-2 text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                placeholder="••••••••"
                {...register('password')}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                type="password"
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            {props.error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                {props.error}
              </div>
            )}
            <Button
              type="submit"
              isLoading={isLoading || isSubmitting}
              variant="primary"
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign in as Admin'}
            </Button>
            <div className="text-center">
              <Link 
                href="/auth/student/signin" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Not an admin? Sign in as student
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;