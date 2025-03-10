'use client';

import { ReactNode } from 'react';
import { UserProvider } from './components/UserContext';
import AuthProvider from './providers/AuthProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </AuthProvider>
  );
}
