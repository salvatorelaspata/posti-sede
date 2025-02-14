
import { PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import { AuthContext } from './auth';

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value= {{
    signIn: () => {
      // Perform sign-in logic here
      setSession('xxx');
    },
      signOut: () => {
        setSession(null);
      },
        session,
        isLoading,
      }
}>
  { children }
  </AuthContext.Provider>
  );
}
