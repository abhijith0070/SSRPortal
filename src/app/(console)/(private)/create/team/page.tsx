// @ts-nocheck
'use client';
import React, { FormEvent } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';

import Step0 from './step0';
import Step1 from './step1';

import { addTeam } from '@/lib/actions/adminActions';

const CreateTeamPage = ({ mentors }: any) => {

  const router = useRouter();
    
  const [year, setYear] = React.useState<string | null>(null);
  const [teamNumber, setTeamNumber] = React.useState<number>(0);
  const [mentor, setMentor] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<0 | 1>(0);
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!year || !teamNumber || !mentor) {
      toast.error('Please fill all the fields');
      return;
    }
    
    const teamCode = `SSR${year?.slice(2)}${teamNumber?.toString().padStart(3, '0')}`.replace('-', '');
    
    addTeam(teamCode, mentor)
      .then((res) => {
        if(res?.error) {
          toast.error(res?.error || res?.error?.message || 'Something went wrong');
          console.error(res?.error);
          return;
        }
        toast.success('Team created successfully. \n Taking you to the team page...');
        router.push(`/manage/teams?t=${teamCode}`);
      }).catch((err: any) => {
        toast.error('Something went wrong');
        console.error(err);
      });
  };

  return (
      <div className="p-5 flex-grow flex items-center justify-center flex-col gap-4">
          <div className="bg-white w-full h-full shadow-lg flex flex-col rounded-lg pt-6 pb-4 px-4">
              <div className="pb-4 flex justify-between items-center">
                  <Link href="/dashboard" className="flex gap-2 items-center text-primary">
                      <ArrowLeftIcon size="18" />
                      {' '}
                      Go Back
                  </Link>
              </div>
              <div className="border flex-grow flex flex-col items-center justify-center">
                  <form className="grid grid-cols-1 w-[430px] gap-4" onSubmit={handleSubmit}>
                      {step === 0 ? (
                          <Step0
                              year={year}
                              setYear={setYear}
                              teamNumber={teamNumber}
                              setTeamNumber={setTeamNumber}
                              nextStep={() => setStep(1)}
                          />
                      ) : (
                          <Step1
                              mentors={mentors}
                              mentor={mentor}
                              setMentor={setMentor}
                              prevStep={() => setStep(0)}
                              team={`SSR${year?.slice(2)}-${teamNumber?.toString().padStart(3, '0')}`}
                          />
                      )}
                  </form>
              </div>
          </div>
      </div>
  );
};

export default CreateTeamPage;