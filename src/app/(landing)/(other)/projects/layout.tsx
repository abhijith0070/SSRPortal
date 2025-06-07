'use client';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const ProjectsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <QueryClientProvider client={queryClient}>
          {children}
      </QueryClientProvider>
  );
};


export default ProjectsLayout;