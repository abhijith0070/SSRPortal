'use client';
import { createContext, useContext } from 'react';

type TUser = {
  id: string,
  name: string,
  email: string,
  type: 'MENTOR' | 'STUDENT' | 'ADMIN',
  avatarID?: string | null,
};

type TAppContext = { user: TUser | null, };

const AppContext = createContext<TAppContext>({ user: null });

const AppContextProvider = ({ children, user }: { children: React.ReactNode, user: TUser | null }) => {

  return (
      <AppContext.Provider value={{ user }}>
          {children}
      </AppContext.Provider>
  );
};

export const useUser = () => useContext(AppContext).user;

export default AppContextProvider;