"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';
import AdminSidebar from '@/app/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* サイドバー */}
      <AdminSidebar />
      
      {/* メインコンテンツ */}
      <div className="flex-1 overflow-auto">
        <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
      
      {/* トースト通知 */}
      <Toaster position="top-right" />
    </div>
  );
}
