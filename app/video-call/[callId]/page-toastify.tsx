"use client";

import React from 'react';
import VideoCallClientToastify from './VideoCallClientToastify';
import { useSavedSession } from '@/components/session';

// URL パラメータを型付け
type Params = {
  params: {
    callId: string;
  };
};

// ビデオ通話ページコンポーネント
export default function VideoCallPage({ params }: Params) {
  const { callId } = params;
  const { session, loading, error } = useSavedSession();

  // セッションロード中の表示
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>ロード中...</p>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <p className="text-red-500 mb-4">エラーが発生しました</p>
          <p className="mb-4">{error}</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            ログインページへ
          </a>
        </div>
      </div>
    );
  }

  // 認証済みでない場合はログインページへリダイレクト
  if (!session) {
    window.location.href = '/login';
    return null;
  }

  // メインコンテンツ
  return (
    <div>
      <VideoCallClientToastify callId={callId} />
    </div>
  );
}
