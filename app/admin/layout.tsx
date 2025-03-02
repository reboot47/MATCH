"use client";

import AdminLayout from '@/components/admin/AdminLayout';
import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  // 管理者ログインページの場合はリダイレクトしない
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // 認証チェック - 未認証ユーザーをログインページにリダイレクト
  if (status === 'unauthenticated') {
    redirect('/admin/login'); // 管理者ログインページにリダイレクト
  }
  
  // ロールチェック - 管理者でないユーザーをホームページにリダイレクト
  if (status === 'authenticated' && 
      session?.user?.role !== 'admin' && 
      session?.user?.role !== 'operator') {
    redirect('/');
  }

  return <AdminLayout>{children}</AdminLayout>;
}
