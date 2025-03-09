import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { diagnostics } from "@/auth";
import { db } from "@/lib/db";

/**
 * 開発環境専用のセッションデバッグAPI
 * Next Auth v5のサーバーサイドセッション情報とクライアントセッションの比較に使用
 */
export async function GET(request: NextRequest) {
  // 開発環境でのみ動作
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    // セッション情報を取得
    const session = await auth();
    
    // データベース接続テスト
    let dbConnectionOk = false;
    let dbError = null;
    let dbStats = null;
    
    try {
      // 簡単なクエリでデータベース接続をテスト
      const userCount = await db.user.count();
      dbConnectionOk = true;
      dbStats = {
        userCount,
        connectionSuccessful: true,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      console.error("データベース接続エラー:", error);
      dbError = error instanceof Error ? error.message : '不明なデータベースエラー';
    }
    
    // 環境変数情報（機密情報を除外）
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL ? "[SET]" : "[NOT SET]",
      DATABASE_URL: process.env.DATABASE_URL ? "[SET]" : "[NOT SET]",
    };

    // リクエスト情報
    const requestInfo = {
      headers: Object.fromEntries(request.headers.entries()),
      cookies: Object.fromEntries(
        request.cookies.getAll().map(c => [c.name, c.value])
      ),
      url: request.url,
      method: request.method,
    };

    // セッション診断情報を生成
    const sessionDiagnostics = diagnostics.getSessionInfo(session);

    // レスポンスにセキュリティヘッダーを追加
    return NextResponse.json(
      {
        serverSession: session,
        diagnostics: sessionDiagnostics,
        environment: envInfo,
        request: requestInfo,
        database: {
          connected: dbConnectionOk,
          error: dbError,
          stats: dbStats
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-Debug-Mode": "enabled",
        },
      }
    );
  } catch (error: any) {
    console.error("Session debug API error:", error);
    
    // エラー分析情報を含む
    const errorAnalysis = diagnostics.analyzeSessionError(error);
    
    return NextResponse.json(
      {
        error: "Failed to fetch session",
        message: error.message,
        errorDetails: errorAnalysis,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
