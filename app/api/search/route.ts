import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { parseSearchParams } from '@/app/utils/parseSearchParams';

export async function GET(request: NextRequest) {
  try {
    // セッションチェック
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }

    // クエリパラメーターを取得
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    // 検索条件を作成
    const whereConditions = parseSearchParams(searchParams);

    // サーバーセッションのユーザーIDを取得
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // 自分自身を除外する条件を追加
    whereConditions.id = { not: currentUser.id };

    // ユーザー検索を実行
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          ...whereConditions,
          // クエリがある場合は名前または場所で検索
          ...(query ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { location: { contains: query, mode: 'insensitive' } },
              { bio: { contains: query, mode: 'insensitive' } }
            ]
          } : {})
        },
        select: {
          id: true,
          name: true,
          age: true,
          gender: true,
          location: true,
          bio: true,
          height: true,
          job: true,
          education: true,
          drinking: true,
          smoking: true,
          relationshipGoal: true,
          isLive: true,
          photos: {
            select: {
              id: true,
              url: true,
              type: true,
              isMain: true,
              thumbnailUrl: true
            },
            orderBy: { order: 'asc' }
          },
          appealTags: {
            select: {
              id: true,
              name: true,
              category: true
            }
          }
        },
        orderBy: [
          { updatedAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.user.count({
        where: {
          ...whereConditions,
          // クエリがある場合は名前または場所で検索
          ...(query ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { location: { contains: query, mode: 'insensitive' } },
              { bio: { contains: query, mode: 'insensitive' } }
            ]
          } : {})
        }
      })
    ]);

    // ページネーション情報
    const pagination = {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    };

    // ユーザーデータのフォーマットを整える
    const formattedUsers = users.map(user => {
      const mainPhoto = user.photos.find(photo => photo.isMain)?.url || 
                       (user.photos.length > 0 ? user.photos[0].url : null);
      
      const hasVideo = user.photos.some(photo => photo.type === 'video');
      const videoUrl = hasVideo 
        ? user.photos.find(photo => photo.type === 'video')?.url 
        : null;
      const videoThumbnailUrl = hasVideo 
        ? user.photos.find(photo => photo.type === 'video')?.thumbnailUrl 
        : null;

      return {
        ...user,
        mainPhoto,
        hasVideo,
        videoUrl,
        videoThumbnailUrl
      };
    });

    return NextResponse.json({ 
      users: formattedUsers, 
      pagination 
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: '検索中にエラーが発生しました。もう一度お試しください。' },
      { status: 500 }
    );
  }
}
