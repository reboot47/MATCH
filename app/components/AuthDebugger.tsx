'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

/**
 * 認証デバッガーコンポーネント（開発環境でのみ使用）
 * 認証状態のデバッグ情報を表示します
 */
export default function AuthDebugger() {
  const { data: session, status } = useSession();
  const [apiInfo, setApiInfo] = useState<any>(null);
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 開発環境でのみ表示する
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  // 診断情報を取得
  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 認証状態を確認
      const authResponse = await axios.get('/api/debug/auth-check');
      setApiInfo(authResponse.data);
      
      // データベース接続を確認
      const dbResponse = await axios.get('/api/debug/db-check');
      setDbInfo(dbResponse.data);
    } catch (err) {
      console.error('診断エラー:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4 rounded shadow-md text-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-yellow-800">🔍 認証デバッガー（開発環境専用）</h3>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-xs"
          onClick={runDiagnostics}
          disabled={loading}
        >
          {loading ? '診断中...' : '診断実行'}
        </button>
      </div>
      
      <div className="mt-2">
        <div className="mb-2">
          <span className="font-semibold">セッション状態:</span> {status}
        </div>
        <div className="mb-2">
          <span className="font-semibold">認証状態:</span> {session ? '認証済み' : '未認証'}
        </div>
        {session && (
          <div className="mb-2">
            <span className="font-semibold">ユーザーID:</span> {session.user?.id}
            <br />
            <span className="font-semibold">名前:</span> {session.user?.name}
            <br />
            <span className="font-semibold">メール:</span> {session.user?.email}
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-red-600 bg-red-50 p-2 rounded">
          <span className="font-semibold">エラー:</span> {error}
        </div>
      )}
      
      {apiInfo && (
        <div className="mt-2 border-t pt-2 text-xs">
          <div className="font-semibold mb-1">API診断:</div>
          <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(apiInfo, null, 2)}
          </pre>
        </div>
      )}
      
      {dbInfo && (
        <div className="mt-2 border-t pt-2 text-xs">
          <div className="font-semibold mb-1">DB診断:</div>
          <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-20">
            {JSON.stringify(dbInfo, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        問題が発生した場合は、ブラウザのCookieをクリアして再ログインするか、
        開発サーバーを再起動してください。
      </div>
    </div>
  );
}
