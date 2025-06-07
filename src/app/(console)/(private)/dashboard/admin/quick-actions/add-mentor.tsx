import toast from "react-hot-toast";
import { TextField } from '@mui/material';

import Button from '@/components/button';
import { addUser } from '@/lib/actions/admin/quickActions';

const AddMentorForm = ({ handleClose }: { handleClose: () => void }) => {

  const formAddMentor = (data: FormData) => {

    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const password = data.get('password');

    addUser(JSON.stringify({ firstName, lastName, email, password }), 'MENTOR')
      .then((res:any) => {
        if(res?.error) {
          toast.error(res?.error);
          return;
        }
        toast.success('Mentor add successfully');
        handleClose();
      }).catch((err: any) => {
        toast.error('Something went wrong');
        console.error(err);
      });
  };
    
  return (
      <form action={formAddMentor}>
          <div>
              <div className="text-2xl font-bold text-primary">Add Mentor</div>
              <div className="text-xs text-gray-500 mt-2">
                  Every mentor will be able to create and update teams. The mentor will be able to view the details of their teams and projects.
              </div>
          </div>
          <div className="mt-8 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                  <TextField
                      variant="outlined"
                      label="First Name"
                      name="firstName"
                  />
                  <TextField
                      variant="outlined"
                      label="Last Name"
                      name="lastName"
                  />
              </div>
              <TextField
                  variant="outlined"
                  label="Email"
                  name="email"
              />
              <TextField
                  variant="outlined"
                  label="Password"
                  type="password"
                  name="password"
              />
              
              <Button variant="primary" type="submit" className="mt-2">
                  Add Mentor
              </Button>
          </div>
      </form>
  );
};

export default AddMentorForm;