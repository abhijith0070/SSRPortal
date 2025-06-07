'use server';

import bcrypt from 'bcryptjs';

import {
  sendMail,
} from '../mail';
import { signJwt, verifyJwt } from '../jwt';

import { prisma } from '@/lib/db/prisma';



export async function registerUser(firstName:string, lastName:string, password:string, email:string) {

  if(!firstName || !lastName || !password || !email) {
    return { error: 'Please fill in all fields!', status: 400 };
  }

  if(await prisma.user.findUnique({ where: { email } })) {
    return { error: 'User already exists!', status: 400 };
  }

  const hashPass = await bcrypt.hash(password, 10);
  try {
    const result = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        emailVerified: new Date(),
        password: hashPass,
      },
    });

    // const jwtUserId = signJwt({
    //   id: result.id,
    // });
    // const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
    // const body = compileActivationTemplate(firstName, activationUrl);
    // await sendMail({ to: user.email, subject: 'Activate Your Account', body });
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Something went wrong', status: 500 };
  }
}

type ActivateUserFunc = (
  jwtUserId: string
) => Promise<'userNotExist' | 'alreadyActivated' | 'success'>;

export const activateUser: ActivateUserFunc = async (jwtUserID) => {
  const payload = verifyJwt(jwtUserID);
  const userId = payload?.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if(!user) return 'userNotExist';
  if(user.emailVerified) return 'alreadyActivated';
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });
  return 'success';
};

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if(!user) throw new Error('The User Does Not Exist!');

  //  Send Email with Password Reset Link
  const jwtUserId = signJwt({
    id: user.id,
  });
  const resetPassUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${jwtUserId}`;
  // const body = compileResetPassTemplate(user.firstName, resetPassUrl);
  const sendResult = await sendMail({
    to: user.email,
    subject: 'Reset Password',
    body: 'body',
  });
  return sendResult;
}

type ResetPasswordFucn = (
  jwtUserId: string,
  password: string
) => Promise<'userNotExist' | 'success'>;

export const resetPassword: ResetPasswordFucn = async (jwtUserId, password) => {
  const payload = verifyJwt(jwtUserId);
  if(!payload) return 'userNotExist';
  const userId = payload.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if(!user) return 'userNotExist';

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: await bcrypt.hash(password, 10),
    },
  });
  if(result) return 'success';
  else throw new Error('Something went wrong!');
};
