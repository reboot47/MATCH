import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// 管理者ユーザーのIDのリスト（実際の運用では環境変数や管理者フラグを使用）
const ADMIN_USER_IDS = ["1"];

export async function middleware(request: NextRequest) {
  console.log("ミドルウェア実行:", request.nextUrl.pathname);
  
  // admin/loginページへのアクセスは処理しない
  if (request.nextUrl.pathname === "/admin/login") {
    console.log("admin/login: 処理をスキップ");
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });
  console.log("トークン:", token);
  
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  console.log("管理者ルート:", isAdminRoute);
  
  // ログインしていない場合は、ログインページへリダイレクト
  if (!token) {
    console.log("未認証: ログインページへリダイレクト");
    const url = new URL("/login", request.url);
    if (isAdminRoute) {
      url.pathname = "/admin/login";
    }
    return NextResponse.redirect(url);
  }
  
  // 管理者ルートへのアクセスの場合、管理者権限を検証
  if (isAdminRoute) {
    // ユーザーIDを取得
    const userId = token.sub;
    console.log("ユーザーID:", userId);
    console.log("ロール:", token.role);
    
    // 管理者IDリストに含まれていない、またはロールがadminでない場合はアクセス拒否
    if (!ADMIN_USER_IDS.includes(userId as string) && token.role !== "admin") {
      console.log("管理者権限なし: トップページへリダイレクト");
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// 保護するパスを指定
export const config = {
  matcher: [
    // admin/login以外のadminパス（negative lookahead構文を使用）
    "/admin/((?!login).)*",
    "/dashboard/:path*",
    "/settings/:path*",
  ],
};
