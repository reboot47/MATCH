/**
 * session-helper.ts
 * 認証セッション関連のヘルパー関数とユーティリティ
 * Next Auth v5向けに最適化
 */

import { Session } from "next-auth";
import { diagnostics } from "@/auth";

// セッション状態のタイプ
export type SessionState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  error: Error | null;
  diagnostics?: any;
};

/**
 * セッション診断のための拡張情報
 */
export type SessionDiagnostics = {
  isValid: boolean;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  hasSession: boolean;
  hasUser: boolean;
  hasUserId: boolean;
  expiresIn?: number; // 秒単位での残り時間
  isExpired?: boolean;
  tokenAge?: number; // トークン経過時間（分）
  environment: string;
  timestamp: string;
  sessionId?: string; // セッションIDの一部（安全のため完全なものではない）
  errors?: string[];
};

/**
 * セッションオブジェクトを検証し、必要な情報が含まれているか確認
 * @param session 検証するセッションオブジェクト
 * @returns 検証結果とエラー情報を含むオブジェクト
 */
export function validateSession(session: Session | null): { 
  isValid: boolean; 
  reason?: string;
  details?: any;
} {
  if (!session) {
    return { isValid: false, reason: "セッションが存在しません" };
  }

  if (!session.user) {
    return { isValid: false, reason: "ユーザー情報が存在しません" };
  }

  if (!session.user.id) {
    return { isValid: false, reason: "ユーザーIDが存在しません" };
  }

  // セッション有効期限を確認
  if (session.expires) {
    const expires = new Date(session.expires);
    const now = new Date();
    
    if (expires < now) {
      return { 
        isValid: false, 
        reason: "セッションの有効期限が切れています", 
        details: {
          expires: expires.toISOString(),
          now: now.toISOString(),
          diff: Math.round((now.getTime() - expires.getTime()) / 1000) // 秒単位
        }
      };
    }
  }

  return { isValid: true };
}

/**
 * セッションの詳細な診断情報を生成
 * @param session セッションオブジェクト
 * @param status 認証状態 ('loading' | 'authenticated' | 'unauthenticated')
 * @param error エラーオブジェクト（存在する場合）
 * @returns 診断情報を含むオブジェクト
 */
export function generateSessionDiagnostics(
  session: Session | null, 
  status: 'loading' | 'authenticated' | 'unauthenticated' = 'unauthenticated',
  error: Error | null = null
): SessionDiagnostics {
  const validation = validateSession(session);
  
  const now = new Date();
  const expires = session?.expires ? new Date(session.expires) : null;
  const expiresIn = expires ? Math.round((expires.getTime() - now.getTime()) / 1000) : undefined;
  
  // エラーメッセージの収集
  const errors: string[] = [];
  if (validation.reason) {
    errors.push(validation.reason);
  }
  if (error) {
    errors.push(error.message);
  }
  
  // セッションIDの安全な取得（あれば）
  let sessionId: string | undefined = undefined;
  if (session && 'id' in session) {
    const id = (session as any).id;
    if (typeof id === 'string' && id.length > 8) {
      sessionId = `${id.slice(0, 4)}...${id.slice(-4)}`;
    }
  }
  
  return {
    isValid: validation.isValid,
    status: status,
    hasSession: !!session,
    hasUser: !!session?.user,
    hasUserId: !!session?.user?.id,
    expiresIn,
    isExpired: expires ? expires < now : undefined,
    tokenAge: session?.user?.id ? undefined : undefined, // セキュリティ上の理由で削除
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: now.toISOString(),
    sessionId,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * セッション更新が必要かどうかを判断
 * @param session 現在のセッション
 * @param maxAgeMs 最大有効期間（ミリ秒）
 * @param refreshThresholdMs 更新閾値（ミリ秒）- この時間を下回るとセッション更新
 * @returns 更新が必要かどうかとその理由を含むオブジェクト
 */
export function shouldRefreshSession(
  session: Session | null, 
  maxAgeMs: number = 30 * 60 * 1000, // デフォルト30分
  refreshThresholdMs: number = 5 * 60 * 1000 // デフォルト5分
): { 
  shouldRefresh: boolean; 
  reason?: string;
  expiresIn?: number;
  thresholdSeconds?: number;
} {
  // セッションがない場合は更新不要（新規作成が必要）
  if (!session) {
    return { shouldRefresh: false, reason: 'セッションがありません' };
  }

  // 有効期限がない場合は更新必要
  if (!session.expires) {
    return { shouldRefresh: true, reason: '有効期限が設定されていません' };
  }

  const now = new Date();
  const expires = new Date(session.expires);
  
  // すでに期限切れの場合
  if (expires < now) {
    return { 
      shouldRefresh: true, 
      reason: 'セッションの有効期限が切れています',
      expiresIn: -1 * Math.round((now.getTime() - expires.getTime()) / 1000) // 負の秒数
    };
  }
  
  // 残り時間（ミリ秒）
  const timeLeftMs = expires.getTime() - now.getTime();
  
  // 更新閾値を下回った場合は更新
  if (timeLeftMs < refreshThresholdMs) {
    return { 
      shouldRefresh: true, 
      reason: '更新閾値を下回りました',
      expiresIn: Math.round(timeLeftMs / 1000), // 秒数
      thresholdSeconds: Math.round(refreshThresholdMs / 1000)
    };
  }
  
  return { 
    shouldRefresh: false,
    expiresIn: Math.round(timeLeftMs / 1000) // 秒数
  };
}
