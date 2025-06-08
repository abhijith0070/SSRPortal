'use client';

import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@mui/material';
import toast from "react-hot-toast";
import { ArrowUpCircleIcon } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import ProjectCard from '@/components/ProjectCard';
import ProjectsSidebar from '@/app/(landing)/(other)/projects/sidebar';

const ProjectsMain = ({ initialData }: any) => {

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const { ref, inView } = useInView();
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState({});

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if(term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const query = searchParams.get('query')?.toString() ?? '';

  const { isLoading, isError, data, error, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfiniteQuery(
          'projects',
          async ({ pageParam = '' }) => {
            const res = await fetch('/api/get/projects?cursor=' + (pageParam || '') + '&query=' + query);
            return res.json();
          },
          {
            initialData,
            getNextPageParam: (lastPage) => lastPage ? lastPage?.nextId : false,
          },
        );

  useEffect(() => {
    if(!scrollRef?.current) return;

    // @ts-ignore
    const onScroll = () => setScrolled(scrollRef?.current?.scrollTop > 20);
    scrollRef?.current?.addEventListener('scroll', onScroll);
    return () => scrollRef?.current?.removeEventListener('scroll', onScroll);
  }, [scrollRef]);
  
  useEffect(() => {
    if(inView && hasNextPage)
      fetchNextPage();
  }, [inView]);

  if(isLoading) return (
      <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
      </div>
  );
  if(isError) {
    toast.error(JSON.stringify(error));
    return (
        <div className="text-center text-2xl font-bold text-red-500">
            Something went wrong
        </div>
    );
  }
  
  return (
      <div className="overflow-auto w-full" ref={scrollRef}>
          <div className="mx-auto container">
              <div className="pt-12" />
              <div className="max-w-md px-4 mb-12">
                  <div className="text font-bold text-primary mb-3">Search Projects</div>
                  <ProjectsSidebar handleSearch={handleSearch} filter={filter} setFilter={setFilter} />
              </div>
              <div className="flex flex-wrap justify-center items-center px-4 gap-6">
                  {data && data?.pages?.map((page) => {
                    return (
                        <React.Fragment key={page.nextId ?? 'lastPage'}>
                            {page.projects.map((p: any) => (
                                <ProjectCard key={p.id} project={p} />
                            ))}
                        </React.Fragment>
                    );
                  })}

                  {(isFetchingNextPage || !data) ? (
                      <div className="bg-white group rounded-lg h-[170px] w-auto aspect-[16/6] border flex items-center justify-center">
                          <div className="flex gap-4">
                              <div
                                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                  role="status"
                              />
                              <div className="uppercase font-light ml-4 text-primary text-xl">
                                  Loading
                              </div>
                          </div>
                      </div>
                  ) : null}

                  <span style={{ visibility: 'hidden' }} ref={ref}>
                      intersection observer marker
                  </span>
                  <div className="pt-12" />
              </div>
              <div className="fixed bottom-0 right-0 mr-4 mb-4">
                  <button
                      title="Scroll to top"
                      className={scrolled ? 'block' : 'hidden'}
                      onClick={() => scrollRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                      <ArrowUpCircleIcon />
                  </button>
              </div>
          </div>
      </div>
  );
};

export default ProjectsMain;