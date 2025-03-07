import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

// 管理者ユーザーのIDのリスト（実際の運用では環境変数や管理者フラグを使用）
const ADMIN_USER_IDS = ["1", "4"];

// 保護対象外のパス
const PUBLIC_PATHS = ["/admin-login", "/admin/login", "/login"];

// リダイレクト・マッピングは実際の画像ファイル置き換えにより不要になりました

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 実際の画像ファイルを生成したため、リダイレクト処理は不要になりました
  
  // 保護対象外のパスはスキップ
  if (PUBLIC_PATHS.some(path => pathname === path)) {
    return NextResponse.next();
  }

  // 管理者パスかどうかをチェック
  const isAdminRoute = pathname.startsWith("/admin");
  
  if (!isAdminRoute) {
    // 管理者ルート以外は認証チェックをせずに通過
    return NextResponse.next();
  }
  
  const session = await auth();
  
  // ログインしていない場合は、ログインページへリダイレクト
  if (!session || !session.user) {
    console.log("未認証: 管理者ログインページへリダイレクト");
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }
  
  // 管理者権限を検証
  const userId = session.user.id;
  const userRole = session.user.role;
  console.log("認証情報検証:", { userId, userRole });
  
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
