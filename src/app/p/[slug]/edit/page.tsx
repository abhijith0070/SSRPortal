import { notFound } from 'next/navigation';
import { Project } from '@prisma/client';

import { getProject } from '@/lib/actions/projectActions';
import auth from '@auth';
import ProjectEditor from '@/components/must-have/ProjectEditor';
import AppView from '@/app/(console)/_appview';

const ProjectSlugEditPage = async ({ params }) => {

  const session = await auth();
  const user = session?.user;

  if(!user?.isAdmin) notFound();
  
  const project = await getProject(params.slug);

  // @ts-ignore
  if(project?.error) notFound(); 
  
  return (
      <AppView>
          <ProjectEditor project={project as Project} />
      </AppView>
  );
};

export default ProjectSlugEditPage;