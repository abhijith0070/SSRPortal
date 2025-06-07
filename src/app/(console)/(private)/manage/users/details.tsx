import React from 'react';

import { TUser } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserDetails = ({ user }: { user: TUser | null }) => {

  if(!user) {
    return (
        <Card className="w-full p-6 flex items-center justify-center text-gray-500">
            <p className="text-center">No project selected. Please select a project to view its details.</p>
        </Card>
    );
  }

  const { firstName, lastName, email, id } = user;

  return (
      <Card className="w-full p-6">
          <CardHeader>
              <div className="flex justify-center gap-2 mb-6">
                  {/*<Button variant="primary" className="font-semibold" link={`/p/${code}`}>*/}
                  {/*    View Project*/}
                  {/*</Button>*/}
                  {/*<Button>*/}
                  {/*    Edit Project*/}
                  {/*</Button>*/}
                  {/*<Button>*/}
                  {/*    Start Review*/}
                  {/*</Button>*/}
              </div>
              <CardTitle className="text-primary text-xl font-semibold">Mentor Details</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                  <div className="flex items-center gap-4">
                      <div className="text-gray-500 w-24">First Name</div>
                      <div>{firstName}</div>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="text-gray-500 w-24">Last Name</div>
                      <div>{lastName}</div>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="text-gray-500 w-24">Email</div>
                      <div>{email}</div>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="text-gray-500 w-24">ID</div>
                      <div>{id}</div>
                  </div>
              </div>
          </CardContent>
      </Card>
  )
  ;
};

export default UserDetails;