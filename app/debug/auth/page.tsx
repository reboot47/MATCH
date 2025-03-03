"use client";

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AuthDebugPage() {
  const { data: session, status } = useSession();
  const [sessionJson, setSessionJson] = useState<string>('');

  useEffect(() => {
    if (session) {
      setSessionJson(JSON.stringify(session, null, 2));
    }
  }, [session]);

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">認証デバッグページ</h1>
      
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">セッションステータス</h2>
        <p className="text-lg">
          ステータス: <span className={`font-bold ${status === 'authenticated' ? 'text-green-600' : 'text-red-600'}`}>
            {status === 'loading' ? '読み込み中...' : 
             status === 'authenticated' ? '認証済み' : '未認証'}
          </span>
        </p>
      </div>

      {status === 'authenticated' && session ? (
        <div className="mb-8">
          <div className="p-4 bg-green-50 border border-green-200 rounded mb-4">
            <h2 className="text-xl font-semibold mb-2">認証情報</h2>
            <p><strong>名前:</strong> {session.user?.name || 'なし'}</p>
            <p><strong>メール:</strong> {session.user?.email || 'なし'}</p>
            <p><strong>ID:</strong> {session.user?.id || 'なし'}</p>
            <p><strong>ロール:</strong> {session.user?.role || 'なし'}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">セッション詳細</h3>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-auto text-sm">
              {sessionJson}
            </pre>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded"
            >
              ログアウト
            </button>
          </div>
        </div>
      ) : status !== 'loading' && (
        <div className="mb-8 p-4 border rounded bg-red-50">
          <h2 className="text-xl font-semibold mb-4">未認証</h2>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => signIn('credentials', { 
                callbackUrl: '/debug/auth',
                email: 'test@linebuzz.jp',
                password: 'test123'
              })}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
            >
              テストユーザーとしてログイン
            </button>
            <button
              onClick={() => signIn('credentials', { 
                callbackUrl: '/debug/auth',
                email: 'admin@linebuzz.jp',
                password: 'admin123'
              })}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded"
            >
              管理者としてログイン
            </button>
            <button
              onClick={() => signIn('google', { callbackUrl: '/debug/auth' })}
              className="bg-white text-gray-800 border border-gray-300 py-2 px-6 rounded flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                />
                <path
                  fill="#34A853"
                  d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98c-.8 1.68-1.26 3.57-1.26 5.38s.46 3.7 1.26 5.38l3.98-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12.255 5.04c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.08-1.94-4.8-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              Googleでログイン
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex space-x-4">
        <Link href="/" className="text-blue-600 hover:underline">ホームに戻る</Link>
        <Link href="/profile" className="text-blue-600 hover:underline">プロフィールページへ</Link>
      </div>
    </div>
  );
}
