// @ts-nocheck
import toast from "react-hot-toast";
import { notFound } from 'next/navigation';

import ProjectsMain from '@/app/(landing)/(other)/projects/main';


const ProjectsPage = () => {

  // const { query } = await params;
  // const projects = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/get/projects?query=${query ?? ''}`).then((res) => res.json());
  //
  // if(projects?.error) {
  //   toast.error(projects.error);
  //   setTimeout(() => {
  //     notFound();
  //   }, 5000);
  // }
      
  
  // const handleSearch = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log(e.target);
  // };
    
  return (
      <div className="flex max-h-screen">
          <ProjectsMain />
      </div>
  );
};

export default ProjectsPage;