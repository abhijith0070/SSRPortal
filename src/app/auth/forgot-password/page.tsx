'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { z } from 'zod';

import { forgotPassword } from '@/lib/actions/authActions';

const FormSchema = z.object({
  email: z.string().email('Please enter a valid email!'),
});

type InputType = z.infer<typeof FormSchema>;

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const submitRequest: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await forgotPassword(data.email);
      if(result) toast.success('Reset password link was sent to your email.');
      reset();
    } catch (e) {
      console.log(e);
      toast.error('Something went wrong!');
    }
  };
  return (
      <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md min-w-[330px] md:min-w-[400px] xl:p-0 shadow-lg border">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight text-left tracking-tight text-primary md:text-2xl">
                  Reset Password
              </h1>
              <div className="text-left">
                  Contact your administrator or mentor to reset your password.
              </div>
          </div>
          {/*<form*/}
          {/*    className="flex flex-col gap-2 p-2 border m-2 rounded-md shadow"*/}
          {/*    onSubmit={handleSubmit(submitRequest)}*/}
          {/*>*/}
          {/*    <div className="text-center p-2">Enter Your Email</div>*/}
          {/*    <Input*/}
          {/*        label="Email"*/}
          {/*        {...register('email')}*/}
          {/*        startContent={<EnvelopeIcon className="w-4" />}*/}
          {/*        errorMessage={errors.email?.message}*/}
          {/*    />*/}
          {/*    <Button*/}
          {/*        isLoading={isSubmitting}*/}
          {/*        type="submit"*/}
          {/*        disabled={isSubmitting}*/}
          {/*        color="primary"*/}
          {/*    >*/}
          {/*        {isSubmitting ? 'Please Wait...' : 'Submit'}*/}
          {/*    </Button>*/}
          {/*</form>*/}
          {/*<Image*/}
          {/*    src="/forgotPass.png"*/}
          {/*    alt="Forgot Password"*/}
          {/*    width={500}*/}
          {/*    height={500}*/}
          {/*    className="col-span-2 place-self-center"*/}
          {/*/>*/}
          
      </div>
  );
};

export default ForgotPasswordPage;
