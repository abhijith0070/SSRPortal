'use client';
import React from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import toast from "react-hot-toast";
import Link from 'next/link';

import Button from '@/components/button';
import InputField from '@/components/InputField';
import { createProject } from '@/lib/actions/admin/quickActions';


const CreateProjectPage = () => {

  const formAction = (data: FormData) => {
    createProject(JSON.stringify(data))
      .then((res) => {
        if(res?.error) {
          toast.error(res?.error);
          return;
        }
        toast.success('Project created successfully. \n Taking you to the project page...');
        // router.push(`/p/${res?.code}`);
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
                  <div className="text-center text-4xl opacity-20 font-bold text-gray-700 mb-12">Welcome to SSR</div>
                  <form className="grid grid-cols-1 w-[400px] gap-4" action={formAction}>
                      <div className="mx-auto">
                          <div className="text-3xl mb-2 text-primary text-center font-bold">Create Project</div>
                          <div className="opacity-40 text-xs max-w-[350px] text-center">
                              Let's get started by creating a project. Fill in the details below to create a project.
                              You can edit and add more details later.
                          </div>
                      </div>
                      <InputField
                          required
                          label="Title"
                          name="name"
                      />
                      <InputField
                          required
                          label="Team ID"
                          name="code"
                      />
                      <div className="flex flex-col gap-2">
                          <label
                              htmlFor="description"
                              className="text-sm flex justify-between -mb-1 font-medium text-gray-700"
                          >
                              Description
                              <span className="text-xs text-gray-400">0/1000</span>
                          </label>
                          <textarea
                              id="description"
                              maxLength={1000}
                              rows={4}
                              name="description"
                              className="border border-gray-300 rounded-lg p-2 bg-gray-50"
                          />
                      </div>
                      <div className="flex justify-end">
                          <Button type="submit" className="w-full" variant="primary">
                              Create Project
                          </Button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  );
};

export default CreateProjectPage;