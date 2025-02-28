import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 特定ユーザーの写真を取得
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    console.log(`写真API呼び出し開始: ユーザーID=${params.userId}`);
    const startTime = Date.now();
    
    const session = await getServerSession(authOptions);
    const userId = params.userId;
    
    // 認証チェック
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }
    
    // 自分のプロフィールかチェック
    if (session.user.id !== userId) {
      return new NextResponse(JSON.stringify({ error: '権限がありません' }), {
        status: 403,
      });
    }
    
    console.log(`認証確認完了: ${Date.now() - startTime}ms`);
    
    // 写真を取得（キャッシュを適用）- 最適化されたクエリ
    const photos = await prisma.photo.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        url: true,
        isMain: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // 最大20枚に制限
    });
    
    const dbTime = Date.now() - startTime;
    console.log(`DB取得完了: ${dbTime}ms, 写真数=${photos.length}`);
    
    // パフォーマンスメトリクスをレスポンスヘッダーに追加
    const headers = {
      'Content-Type': 'application/json',
      'X-Response-Time': `${Date.now() - startTime}`,
      'X-DB-Time': `${dbTime}`,
      // より長いキャッシュ時間を設定
      'Cache-Control': 'public, max-age=600, s-maxage=1200, stale-while-revalidate=1800',
      // ブラウザキャッシュのための追加ヘッダー
      'Expires': new Date(Date.now() + 600000).toUTCString(),
      'Surrogate-Control': 'max-age=1200',
      'Vary': 'Accept-Encoding'
    };
    
    // レスポンスにキャッシュヘッダーを追加
    return new NextResponse(JSON.stringify(photos), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('写真取得エラー:', error);
    return new NextResponse(JSON.stringify({ error: '写真の取得中にエラーが発生しました', details: String(error) }), {
      status: 500,
    });
  }
}
