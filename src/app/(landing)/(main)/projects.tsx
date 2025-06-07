import { ChevronRightIcon } from 'lucide-react';

import Button from '@/components/button';
import ProjectCard from '@/components/ProjectCard';

const PROJECTS = [
  {
    name: 'Vidya',
    location: 'Madgon, Goa',
    // cover: 'https://images.unsplash.com/photo-1577495508048-b635879837f1',
    // description: 'Our mission was to bring about a small but effective and useful change in the lives of some young individuals of this world. We tried to impart whatever small bits of knowledge that we could',
    teamID: '17SSR155',
  },
  {
    name: 'We Believe they can fly ',
    location: 'Chirpur, Madhya Predesh',
    cover: 'https://images.unsplash.com/photo-1577495508048-b635879837f1',
    description: 'SSR 17-156 The project we’ve undertaken has given us lots of memories to cherish and lots of info on the harsh realities on the society. A lot of work needs to be done by man',
    teamID: '17SSR156',
  },
  {
    name: 'We Believe they can fly ',
    location: 'Chirpur, Madhya Predesh',
    cover: 'https://images.unsplash.com/photo-1577495508048-b635879837f1',
    description: 'SSR 17-156 The project we’ve undertaken has given us lots of memories to cherish and lots of info on the harsh realities on the society. A lot of work needs to be done by man',
    teamID: '17SSR156',
  },
];

const Projects = () => {
  return (
      <section className="text-gray-600 bg-white body-font w-full">
          <div className="container px-5 py-24 mx-auto flex flex-wrap">
              <div className="flex justify-between gap-8 flex-wrap w-full ">
                  <div className="flex flex-col justify-center">
                      <div className="text-3xl font-bold text-primary mb-4">
                          Projects
                      </div>
                      <div className="text-sm text-gray-500 max-w-[450px]">
                          A Showcase of Student-Driven Initiatives Transforming Communities. Witness the Power of Compassion, Collaboration, and Social Responsibility as Our Students Lead Change for a Better Tomorrow.
                      </div>
                      <div className="mt-12">
                          <Button link="/projects" className="text-primary !bg-blue-50 hover:bg-blue-100 cursor-pointer">
                              View All Projects
                              <ChevronRightIcon size="18" className="ml-2" />
                          </Button>
                      </div>
                  </div>
                  <div className="col-span-2 flex flex-col items-end max-w-[400px] justify-end gap-4">
                      {PROJECTS.map((project) => (
                          // @ts-ignore
                          <ProjectCard height="150px" key={project.teamID} project={project} />
                      ))}
                  </div>
              </div>
          </div>
      </section>
  );
};

export default Projects;