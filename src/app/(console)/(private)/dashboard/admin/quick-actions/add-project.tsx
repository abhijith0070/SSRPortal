import toast from "react-hot-toast";
import { TextField } from '@mui/material';
import { useRouter } from 'next/navigation';

import Button from '@/components/button';
import { createProject } from '@/lib/actions/admin/quickActions';

const AddProjectForm = ({ handleClose }: { handleClose: () => void }) => {

  const router = useRouter();
    
  const formAddProject = (data: FormData) => {

    const name = data.get('name') as string;
    const description = data.get('description') as string;

    createProject(JSON.stringify({ name, description }))
      .then((res:any) => {
        if(res?.error) {
          toast.error(res?.error);
          return;
        }
        toast.success('Project created successfully');
        handleClose();
        router.push(`/project/${res?.id}/edit`);
      }).catch((err: any) => {
        toast.error('Something went wrong');
        console.error(err);
      });
  };

  return (
      <form action={formAddProject}>
          <div>
              <div className="text-2xl font-bold text-primary">Create Project</div>
              <div className="text-xs text-gray-500 mt-2">
                  You can create a project now and edit further later. The project will be visible set to draft until published.
              </div>
          </div>
          <div className="mt-8 flex flex-col gap-4">
              <TextField
                  variant="outlined"
                  label="Name"
                  name="name"
              />
              <TextField
                  variant="outlined"
                  label="Description"
                  name="description"
                  type="text"
                  multiline
                  rows={4}
              />
              <Button variant="primary" type="submit" className="!py-4">
                  Create Project
              </Button>
          </div>
      </form>
  );
};

export default AddProjectForm;