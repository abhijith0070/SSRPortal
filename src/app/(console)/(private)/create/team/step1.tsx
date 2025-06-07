'use client';
import { ArrowLeftIcon, ArrowRightIcon, UserIcon } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import Button from '@/components/button';

const Step1 = ({ team, mentors, mentor, setMentor, prevStep } : {
  team: string,
  mentor: string | null,
  mentors: any[],
  setMentor: React.Dispatch<React.SetStateAction<string | null>>,
  prevStep: () => void,
}) => {

  return (
      <>
          <div className="mx-auto">
              <div className="text-3xl mb-2 text-primary text-center font-bold">
                  Select Mentor
              </div>
              <div className="text-gray-600 text-center">
                  {team}
              </div>
          </div>

          <div className="flex flex-col justify-between w-full mx-auto gap-6 my-12">
              <div className="gap-4 flex flex-col w-full">
                  {mentors.length > 0 && mentors.map((user: any) => (
                      <Button
                          key={user?.id}
                          className={clsx(
                            'flex !justify-start items-start border border-gray-200 bg-gray-50 hover:border-primary p-2 rounded-lg w-full',
                            mentor === user?.id && 'border-primary',
                          )}
                          onClick={() => setMentor(user?.id)}
                      >
                          <div className="mr-4">
                              {user?.image ? (
                                  <Image
                                      src={user?.image}
                                      alt="avatar"
                                      width={24}
                                      height={24}
                                      className="w-12 h-12 rounded-full"
                                  />
                              ) : (
                                  <UserIcon className="w-12 h-12 p-2.5 rounded-full bg-primary text-white" />
                              )}
                          </div>
                          <div className="flex flex-col items-start">
                              <div className="text-lg">
                                  {user?.firstName}
                                  {' '}
                                  {user?.lastName}
                              </div>
                              <div className="text-sm text-gray-400/90">
                                  {user?.email.split('@')[0]}
                              </div>
                          </div>
                      </Button>
                  ))}
              </div>
          </div>
          <div className="flex justify-between items-center gap-8">
              <Button variant="light" onClick={prevStep}>
                  <ArrowLeftIcon className="mr-2" size="20" />
                  {' '}
                  Back
              </Button>
              <Button
                  variant="primary"
                  type="submit"
              >
                  Create Team
                  {' '}
                  <ArrowRightIcon className="ml-2" size="20" />
              </Button>
          </div>
      </>
  );
};

export default Step1;