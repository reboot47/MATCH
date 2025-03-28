"use client";

import { Toaster } from 'react-hot-toast';

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <Toaster position="top-right" />
    </div>
  );
}
