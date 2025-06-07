'use client';
import Link from 'next/link';
import { ArrowLeftIcon, HomeIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Project } from '@prisma/client';
import { TextField } from '@mui/material';

const ProjectEditor = ({ project: init }: { project: Partial<Project> }) => {
    
  const [project, setProject] = useState(init);
    
  return (
      <div className="px-4 py-6 container mx-auto flex-grow flex flex-col">
          <div className="flex justify-between">
              <div className="flex gap-2">
                  <Link
                      href="/projects"
                      className="text-primary border duration-100 hover:border-primary/40 group bg-slate-200 px-4 py-3 flex items-center justify-center rounded-lg gap-1"
                  >
                      <ArrowLeftIcon size="18" className="opacity-70 group-hover:opacity-100" />
                      {' '}
                      Go back
                  </Link>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                  <Link href="/">
                      <HomeIcon size="18" />
                  </Link>
                  <span>/</span>
                  <Link href="/projects">
                      Projects
                  </Link>
                  <span>/</span>
                  <Link href={`/p/${project?.code}`}>
                      <span className="font-semibold uppercase">{project.code}</span>
                  </Link>
                  <span>/</span>
                  <Link href={`/p/${project?.code}/edit`}>
                      <span className="font-semibold">Edit</span>
                  </Link>
              </div>
          </div>
          <div className="bg-white rounded-lg p-4 mt-6">
              <div className="relative rounded-lg">
                  <div className="flex items-center justify-center flex-col rounded-lg aspect-video min-h-[30rem] w-full object-cover border">
                      <TextField
                          id="p-name"
                          label="Project Title"
                          variant="outlined"
                          value={project.name}
                          onChange={(e) => setProject({ ...project, name: e.target.value })}
                          required
                      />
                  </div>
              </div>
          </div>
      </div>
  );
};

export default ProjectEditor;