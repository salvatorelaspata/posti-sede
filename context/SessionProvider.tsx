
import { PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import { AuthContext } from './auth';

// add tenant to the session  

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: (tenant: string) => {
          // Perform sign-in logic here
          setSession(tenant);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }
      }>
      {children}
    </AuthContext.Provider>
  );
}
