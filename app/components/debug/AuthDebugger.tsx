"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useProfile } from "@/app/hooks/useProfile";
import { validateSession, generateSessionDiagnostics } from "@/lib/auth/session-helper";

/**
 * 認証デバッガーコンポーネント
 * 開発環境でのみ表示され、認証関連の問題をデバッグするための情報を提供
 * 本番環境では表示されない
 */
export default function AuthDebugger() {
  const { data: session, status } = useSession();
  const { profile, error: profileError, isLoading: profileLoading } = useProfile();
  const [serverSession, setServerSession] = useState<any>(null);
  const [isLoadingServer, setIsLoadingServer] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // セッション診断情報
  const sessionDiagnostics = generateSessionDiagnostics(session);
  const sessionValid = validateSession(session);
  
  // サーバーセッション情報をフェッチ
  const fetchServerSession = async () => {
    setIsLoadingServer(true);
    setServerError(null);
    
    try {
      const res = await fetch('/api/debug/session');
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setServerSession(data);
    } catch (err) {
      console.error('Failed to fetch server session:', err);
      setServerError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setIsLoadingServer(false);
    }
  };

  return (
    <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
      <h3 className="font-bold text-base mb-3">認証デバッグ (開発環境のみ)</h3>
      
      <div className="space-y-4">
        {/* クライアントセッション情報 */}
        <div>
          <h4 className="font-semibold mb-1">クライアントセッション状態:</h4>
          <div className="bg-white p-2 rounded border">
            <div><span className="font-medium">Status:</span> {status}</div>
            <div>
              <span className="font-medium">認証済み:</span> 
              <span className={sessionValid.isValid ? "text-green-600" : "text-red-600"}>
                {sessionValid.isValid ? "はい" : "いいえ"}
              </span>
            </div>
            {!sessionValid.isValid && (
              <div className="text-red-500 text-xs">
                {sessionValid.reason}
              </div>
            )}
            {session?.user && (
              <>
                <div><span className="font-medium">ユーザーID:</span> {session.user.id}</div>
                <div><span className="font-medium">メール:</span> {session.user.email}</div>
                <div><span className="font-medium">名前:</span> {session.user.name}</div>
                {session.expires && (
                  <div><span className="font-medium">有効期限:</span> {new Date(session.expires).toLocaleString()}</div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* プロフィール情報 */}
        <div>
          <h4 className="font-semibold mb-1">プロフィール状態:</h4>
          <div className="bg-white p-2 rounded border">
            {profileLoading ? (
              <div>読み込み中...</div>
            ) : profileError ? (
              <div className="text-red-500">エラー: {profileError.message}</div>
            ) : profile ? (
              <>
                <div><span className="font-medium">ID:</span> {profile.id}</div>
                <div><span className="font-medium">名前:</span> {profile.name}</div>
                <div><span className="font-medium">メール:</span> {profile.email}</div>
                {profile.isMockData && (
                  <div className="mt-1 text-amber-600 text-xs font-medium">
                    モックデータ表示中 (API接続エラーが発生)
                  </div>
                )}
              </>
            ) : (
              <div>プロフィールなし</div>
            )}
          </div>
        </div>
        
        {/* サーバーセッションフェッチボタン */}
        <div>
          <button
            onClick={fetchServerSession}
            disabled={isLoadingServer}
            className={`px-3 py-1 rounded text-xs ${
              isLoadingServer 
                ? "bg-gray-300" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isLoadingServer ? "読み込み中..." : "サーバーセッション取得"}
          </button>
          
          {serverError && (
            <div className="mt-2 text-red-500 text-xs">{serverError}</div>
          )}
          
          {serverSession && (
            <div className="mt-2">
              <h4 className="font-semibold mb-1 text-xs">サーバーセッション:</h4>
              <div className="bg-white p-2 rounded border text-xs max-h-40 overflow-auto">
                <pre>{JSON.stringify(serverSession, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
        
        {/* 詳細なセッション診断 */}
        <details className="mt-2">
          <summary className="cursor-pointer text-xs font-medium text-gray-500">
            詳細セッション診断情報
          </summary>
          <div className="mt-1 bg-black text-green-400 p-2 rounded text-xs font-mono overflow-auto max-h-60">
            <pre>{JSON.stringify(sessionDiagnostics, null, 2)}</pre>
          </div>
        </details>
      </div>
    </div>
  );
}
