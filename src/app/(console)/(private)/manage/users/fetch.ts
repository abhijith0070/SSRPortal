import { cookies } from 'next/headers';

const getUsers = async () => {

  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/manage/users/`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies().toString(),
    },
  });

  if(!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};

export default getUsers;