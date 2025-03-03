'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { UserProvider } from '@/components/UserContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </SessionProvider>
  );
}
