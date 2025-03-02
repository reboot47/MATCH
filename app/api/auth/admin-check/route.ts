import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';

/**
 * 管理者権限を確認するAPIエンドポイント
 */
export async function GET(request: NextRequest) {
  try {
    // トークンからセッション情報を取得（NextAuthの新しい方法）
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    console.log('Admin check token:', token);
    
    // セッションが存在しない場合は未認証
    if (!token || !token.email) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }
    
    // JWT内のロール情報を確認（モックユーザー用）
    if (token.role === 'ADMIN' || token.role === 'admin') {
      console.log('管理者権限確認: JWTからADMIN権限を確認しました');
      return NextResponse.json({ isAdmin: true });
    }

    // データベースでのチェック（実ユーザー用）
    try {
      const user = await prisma.user.findUnique({
        where: { email: token.email as string },
        select: { role: true }
      });
      
      console.log('データベースユーザー検索結果:', user);
      
      // 大文字小文字関係なく"admin"を含むロールを許可
      if (user && (
        user.role === 'ADMIN' || 
        user.role === 'admin' || 
        user.role?.toLowerCase() === 'admin'
      )) {
        console.log('管理者権限確認: データベースからADMIN権限を確認しました');
        return NextResponse.json({ isAdmin: true });
      }
    } catch (dbError) {
      console.error('データベース検索エラー:', dbError);
      // データベースエラーでも処理を続行（JWTチェックのみで判断）
    }
    
    // 上記のいずれも該当しない場合はアクセス拒否
    return NextResponse.json(
      { error: '管理者権限がありません' },
      { status: 403 }
    );
  } catch (error) {
    console.error('管理者権限確認エラー:', error);
    return NextResponse.json(
      { error: '管理者権限確認中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
