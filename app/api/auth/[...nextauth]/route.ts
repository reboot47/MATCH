import { handlers } from "@/auth";

// NextAuth v5のAPIルート設定
console.log('NextAuth APIルートを初期化中...');

// 正しいハンドラーをエクスポート
export const GET = handlers.GET;
export const POST = handlers.POST;

// エラーハンドリングのため、すべてのハンドラーをtry-catchでラップしたバージョンも提供
export const HEAD = handlers.GET;
export const OPTIONS = async (req: Request) => {
  try {
    // CORSヘッダーを追加
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('NextAuth OPTIONSエラー:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
