import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    // データベースURLはマスクして表示
    DATABASE_URL: maskSensitiveUrl(process.env.DATABASE_URL),
    // その他の環境変数
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '[設定あり]' : '[未設定]'
  };
  
  return NextResponse.json({
    status: '🟢 成功',
    message: '現在のNext.js実行環境での環境変数',
    env: envVars,
    processEnv: {
      path: process.env.PATH ? '[設定あり]' : '[未設定]',
      home: process.env.HOME,
      user: process.env.USER
    }
  });
}

// 機密情報を含むURLをマスクする関数
function maskSensitiveUrl(url) {
  if (!url) return '[未設定]';
  
  try {
    const parsedUrl = new URL(url);
    // ユーザー名とパスワードをマスク
    return `${parsedUrl.protocol}//${parsedUrl.username}:****@${parsedUrl.host}${parsedUrl.pathname}`;
  } catch (e) {
    return '[無効なURL形式]';
  }
}
