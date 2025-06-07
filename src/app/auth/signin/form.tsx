'use client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { z } from 'zod';
import Button from '@/components/button';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
  callback?: string;
  error?: string;
}

const FormSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .endsWith('@am.amrita.edu', 'Must be an Amrita student email (@am.students.amrita.edu)'),
  password: z.string({
    required_error: 'Please enter your password',
  }).min(6, 'Password must be at least 6 characters'),
});

type InputType = z.infer<typeof FormSchema>;

const LoginForm = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
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

  // const handleGoogleSignIn = async () => {
  //   try {
  //     setIsLoading(true);
  //     const result = await signIn('google', {
  //       callbackUrl: props.callback || '/dashboard',
  //       redirect: false,
  //     });

  //     if (result?.error) {
  //       toast.error(result.error);
  //       return;
  //     }

  //     if (result?.url) {
  //       toast.success('Login successful');
  //       window.location.href = result.url;
  //     }
  //   } catch (error) {
  //     toast.error('An error occurred during Google sign in');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with:', data.email);
      
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: props.callback || '/dashboard/mentor'
      });

      console.log('Sign in result:', result);

      if (result?.error) {
        console.error('Sign in error:', result.error);
        toast.error(result.error);
        return;
      }

      if (result?.url) {
        toast.success('Welcome To SSR Portal');
        window.location.href = result.url;
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
          Login to your account
        </h1>
        <form
          className="space-y-4 md:space-y-8 mt-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="p-2 flex flex-col gap-4">
            <div className="flex flex-col items-start">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Your email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                aria-errormessage={errors.email?.message}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="name@xxx.amrita.edu"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
              <div className="text-xs font-semibold text-gray-400 mt-2">
                use
                <span className="font-monospace bg-gray-200 py-0.5 px-2 mx-1 text-gray-600 rounded">
                  .am.amrita.edu
                </span>
                mail
              </div>
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
              <div className="flex items-center justify-end mt-1 w-full">
                <a
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            {props.error && (
              <div className="text-sm text-red-500">{props.error}</div>
            )}
            <Button
              type="submit"
              isLoading={isLoading || isSubmitting}
              variant="primary"
              className="w-full"
            >
              Login
            </Button>
            {/* <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <img src="/google.png" alt="Google" width={20} height={20} />
              Sign in with Google
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;