"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * メッセージページ - チャットページへリダイレクト
 * 一時的な修正として、/messagesページへのアクセスを/match/chatに転送します
 */
export default function MessagesPage() {
  const router = useRouter();

  useEffect(() => {
    // チャットページにリダイレクト
    router.push('/match/chat');
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">リダイレクト中...</p>
      </div>
    </div>
  );
}
