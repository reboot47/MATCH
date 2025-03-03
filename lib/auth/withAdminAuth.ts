import { NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * API エンドポイント用の管理者認証ラッパー
 * このラッパーは、サーバーサイドのAPIルート内で使用します
 */
export function withAdminAuth<T>(handler: (...args: unknown[]) => Promise<T>) {
  return async (...args: unknown[]) => {
    try {
      // サーバーセッションを取得
      const session = await auth();
      
      // 認証チェック
      if (!session || !session.user) {
        console.error('管理者APIラッパー - 認証情報なし');
        return NextResponse.json(
          { error: '認証されていません。ログインしてください。' },
          { status: 401 }
        );
      }
      
      // 管理者権限チェック
      const userRole = session.user.role as string;
      if (userRole !== 'ADMIN' && userRole !== 'admin') {
        console.error('管理者APIラッパー - 管理者権限なし:', userRole);
        return NextResponse.json(
          { error: '管理者権限がありません。' },
          { status: 403 }
        );
      }
      
      // 認証済みの場合、元のハンドラを実行
      return handler(...args);
    } catch (error) {
      console.error('管理者APIラッパー - エラー:', error);
      return NextResponse.json(
        { error: '認証チェック中にエラーが発生しました。' },
        { status: 500 }
      );
    }
  };
}

// モック認証用の単純化されたバージョン
// 開発環境で認証をバイパスする場合に使用
export function withMockAdminAuth<T>(handler: (...args: unknown[]) => Promise<T>) {
  return async (...args: unknown[]) => {
    // 開発環境では認証をバイパス
    // 本番環境では認証をチェックするようにすべき
    console.log('モック管理者権限チェック - 開発モードのため権限チェックをスキップします');
    return handler(...args);
  };
}
