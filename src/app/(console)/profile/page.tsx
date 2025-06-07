import Image from 'next/image';

import { auth } from '@auth';


const ProfilePage = async () => {
  
  const session = await auth();
  const user = session?.user;
  
  return (
      <div>
          <Image
              height={300}
              width={300}
              src={user?.image ?? ''}
              alt={user?.firstName ?? ''}
              className="rounded-full"
          />
          <div className="grid grid-cols-4 gap-y-4">
              <p>First Name:</p> 
              {' '}
              <p className="col-span-3">{user?.firstName}</p>
              <p>Last Name:</p> 
              {' '}
              <p className="col-span-3">{user?.lastName}</p>
              <p>Email:</p>
              {' '}
              <p className="col-span-3">{user?.email}</p>
              <p>Role:</p>
              {' '}
              <p className="col-span-3">{user?.role}</p>
          </div>
      </div>
  );
};

export default ProfilePage;
