import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// データベース接続をチェックするAPIエンドポイント
export async function GET() {
  const requestId = Date.now().toString(36);
  console.log(`[DB Check API] Request ${requestId}: Checking database connection`);
  
  try {
    // 簡単なクエリを実行してデータベース接続を確認
    const result = await db.$queryRaw`SELECT 1 as connected`;
    console.log(`[DB Check API] Database connection successful ${requestId}:`, result);
    
    return NextResponse.json({
      success: true,
      message: 'データベース接続に成功しました',
      timestamp: new Date().toISOString(),
      result
    });
  } catch (error) {
    console.error(`[DB Check API] Database connection error ${requestId}:`, error);
    
    // エラー詳細をログに記録（本番環境では一部情報を制限）
    const errorDetails = process.env.NODE_ENV === 'development' 
      ? {
          message: error.message,
          code: error.code,
          stack: error.stack
        }
      : {
          message: 'データベース接続に失敗しました'
        };
    
    return NextResponse.json({
      success: false,
      message: 'データベース接続に失敗しました',
      error: errorDetails,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
