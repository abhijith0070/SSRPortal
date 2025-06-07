'use client';
import Link from 'next/link';
import React, { MouseEventHandler } from 'react';
import { ExternalLinkIcon, Share2Icon } from 'lucide-react';

import { TProjectBase } from '@/types/project';
import { default as handle_share } from '@/lib/handle-share';

const ProjectCard = ({ project, height = '170px', isEdit = false }: { project: TProjectBase, height?: string, isEdit?: boolean }) => {

  const handleShare: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handle_share(e, { title: `Hey checkout this SSR project by team ${project.code}`, description: `${project.name} by Team ${project.code}` }, `/p/${project.code}`);
  };

  return (
      <Link
          href={!isEdit ? `/p/${project.code}` : `/p/${project.code}/edit`}
          style={{ height }}
          className="bg-white group rounded-lg w-auto aspect-[16/6] border hover:border-primary transition duration-200"
      >
          <div className="w-full h-full">
              <div className="p-4 flex h-full">
                  <div className="p-2 flex flex-col justify-between flex-grow">
                      <div>
                          <div className="text-sm text-primary font-bold mb-1">
                              {project.code}
                          </div>
                          <div className="text-lg opacity-75 group-hover:opacity-100 mb-1 line-clamp-2">
                              {project.name}
                          </div>
                      </div>
                      <button className="text-gray-500/80 mt-4 text-sm flex items-center gap-2 w-fit">
                          Read more
                      </button>
                  </div>
                  <div className="min-w-[80px] flex flex-col items-center justify-center gap-4 z-50">
                      <button
                          title={`Share ${project.code}'s project`}
                          onClick={handleShare}
                          className="p-4 hover:bg-gray-200 rounded-lg opacity-50 z-20 group-hover:block hidden aspect-square"
                      >
                          <Share2Icon size={20} />

                      </button>
                      {project?.link && (
                          <Link
                              title={`Open ${project.code}'s project submissions`}
                              target="_blank"
                              href={project?.link}
                              onClick={(e) => e.stopPropagation()}
                              className="p-4 aspect-square hidden group-hover:flex flex-col text-primary font-bold justify-center items-center text-lg gap-2 rounded-lg bg-blue-50 backdrop-blur"
                          >
                              <ExternalLinkIcon size="20" />
                          </Link>
                      )}
                  </div>
              </div>
          </div>
      </Link>
  );
};

export default ProjectCard;