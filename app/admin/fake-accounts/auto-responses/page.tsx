"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoResponsesRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // 正しいパスにリダイレクト
    router.replace('/admin/fake-accounts/auto-responder');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>リダイレクト中...</p>
        <p className="text-sm text-gray-500 mt-2">
          正しいURLは <code>/admin/fake-accounts/auto-responder</code> です
        </p>
      </div>
    </div>
  );
}
