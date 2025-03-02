import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// 管理者ユーザーのIDのリスト（実際の運用では環境変数や管理者フラグを使用）
const ADMIN_USER_IDS = ["1", "4"];

// 保護対象外のパス
const PUBLIC_PATHS = ["/admin-login", "/admin/login", "/login"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log("ミドルウェア実行:", pathname);
  
  // 保護対象外のパスはスキップ
  if (PUBLIC_PATHS.some(path => pathname === path)) {
    console.log("保護対象外のパス:", pathname);
    return NextResponse.next();
  }

  // 管理者パスかどうかをチェック
  const isAdminRoute = pathname.startsWith("/admin");
  console.log("管理者ルート:", isAdminRoute);
  
  if (!isAdminRoute) {
    // 管理者ルート以外は認証チェックをせずに通過
    return NextResponse.next();
  }
  
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });
  console.log("トークン:", token);
  
  // ログインしていない場合は、ログインページへリダイレクト
  if (!token) {
    console.log("未認証: 管理者ログインページへリダイレクト");
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }
  
  // 管理者権限を検証
  const userId = token.sub;
  const userRole = token.role;
  console.log("認証情報検証:", { userId, userRole, token });
  
  // 管理者IDリストに含まれているか、ロールがADMIN/adminならアクセス許可
  if (ADMIN_USER_IDS.includes(userId as string) || 
      userRole === "ADMIN" || 
      userRole === "admin") {
    console.log("管理者アクセス許可:", { userId, userRole });
    return NextResponse.next();
  }
  
  // 管理者でなければトップページへリダイレクト
  console.log("管理者権限なし: トップページへリダイレクト");
  return NextResponse.redirect(new URL("/", request.url));
}

// 保護するパスを指定
export const config = {
  matcher: [
    // 管理者関連のパスのみを対象とする
    "/admin/:path*",
    "/admin",
    "/dashboard/:path*",
    "/settings/:path*",
  ],
};
