import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * 管理者認証ミドルウェア
 * 管理者権限を持つユーザーのみがアクセスできるようにする
 */
export async function adminAuthMiddleware(req: NextRequest) {
  try {
    // JWTトークンから認証情報を取得
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET
    });
    
    console.log('管理者APIミドルウェア - トークン:', token);
    
    // セッションが存在しない場合は未認証エラー
    if (!token || !token.email) {
      console.error('管理者APIミドルウェア - 認証情報なし');
      return new NextResponse(
        JSON.stringify({ 
          error: '認証されていません。ログインしてください。' 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // JWTからの直接チェック
    if (token.role === 'ADMIN' || token.role === 'admin') {
      console.log('管理者APIミドルウェア - JWTからADMIN権限確認');
      return null; // 認証成功
    }

    // データベースチェックは省略（JWTのみに依存）
    console.error('管理者APIミドルウェア - 管理者権限なし:', token.role);
    return new NextResponse(
      JSON.stringify({ 
        error: '管理者権限がありません。' 
      }),
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('管理者APIミドルウェア - エラー:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: '認証チェック中にエラーが発生しました。' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
