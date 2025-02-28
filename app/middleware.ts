import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // パブリックパスの定義
  const isPublicPath = [
    '/login',
    '/register',
    '/forgot-password',
    '/api/auth',
    '/_next',
    '/images',
    '/favicon.ico'
  ].some(publicPath => path.startsWith(publicPath));

  // セッショントークンの取得
  const token = request.cookies.get('next-auth.session-token')?.value || 
                request.cookies.get('__Secure-next-auth.session-token')?.value || '';

  console.log("ミドルウェア実行:", path);
  console.log("トークン状態:", !!token);

  // ルートパス「/」の特別処理
  if (path === '/') {
    console.log("ルートパスへのアクセス - loginページへリダイレクト");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 認証が必要なパスへの未認証アクセス
  if (!isPublicPath && !token) {
    console.log("未認証ユーザーが保護されたルートにアクセス - リダイレクト");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 認証済みユーザーのパブリックパスへのアクセス
  if (token && (path === '/login' || path === '/register' || path === '/forgot-password')) {
    console.log("認証済みユーザーが公開認証ルートにアクセス - リダイレクト");
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// マッチャー設定を修正
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
