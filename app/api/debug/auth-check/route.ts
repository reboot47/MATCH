import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { validateSession, generateSessionDiagnostics } from '@/lib/auth/session-helper';

// 認証状態をチェックするAPIエンドポイント
export async function GET(req: NextRequest) {
  const requestId = Date.now().toString(36);
  console.log(`[Auth Check API] Request ${requestId}: Checking authentication status`);
  
  try {
    // 現在のセッションを取得
    const session = await auth();
    
    // セッション検証
    const sessionValidation = validateSession(session);
    
    // セッション診断情報を生成
    const diagnostics = generateSessionDiagnostics(
      session, 
      session ? 'authenticated' : 'unauthenticated'
    );
    
    // ヘッダー情報（認証関連のみ）
    const headers = {
      cookie: req.headers.get('cookie') ? 'Present' : 'Not present',
      authorization: req.headers.get('authorization') ? 'Present' : 'Not present'
    };
    
    // 環境変数情報（セキュリティに関わる値は除外）
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL ? 'Set' : 'Not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
    };
    
    console.log(`[Auth Check API] Authentication status ${requestId}:`, {
      isAuthenticated: !!session,
      validationResult: sessionValidation,
      diagnostics
    });
    
    return NextResponse.json({
      success: true,
      isAuthenticated: !!session,
      sessionValidation,
      diagnostics,
      headers,
      environment: envInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`[Auth Check API] Error ${requestId}:`, error);
    
    return NextResponse.json({
      success: false,
      message: '認証状態の確認中にエラーが発生しました',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
