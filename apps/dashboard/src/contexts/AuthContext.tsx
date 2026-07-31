'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Profile } from '@sterenn/api-contracts';

export type AuthContextType = {
  user: Profile | null;
  setUser: (user: Profile | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export type AuthProviderProps = PropsWithChildren<{
  initialUser?: Profile | null;
}>;

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUserState] = useState<Profile | null>(initialUser);

  const setUser = useCallback((next: Profile | null) => {
    setUserState(next);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user, setUser]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
