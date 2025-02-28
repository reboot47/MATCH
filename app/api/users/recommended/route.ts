import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// おすすめユーザーを取得するAPI
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }
    
    // クエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // ユーザーIDを取得
    const userId = session.user.id;
    
    // おすすめユーザーを取得
    // 自分自身を除外し、エリアでフィルタリング（エリアが指定されている場合）
    const usersQuery = {
      where: {
        id: {
          not: userId
        },
        ...(area ? { location: { contains: area } } : {})
      },
      include: {
        photos: {
          where: {
            isMain: true
          },
          select: {
            id: true,
            url: true,
            isMain: true
          }
        },
        videos: {
          select: {
            id: true,
            url: true
          },
          take: 1
        },
        appealTags: {
          include: {
            appealTag: true
          }
        }
      },
      skip,
      take: limit
    };
    
    // ユーザーデータ取得
    const users = await prisma.user.findMany(usersQuery);
    
    // 総ユーザー数取得（ページネーション用）
    const totalUsers = await prisma.user.count({
      where: usersQuery.where
    });
    
    // レスポンス用にデータを整形
    const formattedUsers = users.map(user => {
      const birthdate = user.birthdate ? new Date(user.birthdate) : null;
      const age = birthdate ? new Date().getFullYear() - birthdate.getFullYear() : null;
      const mainPhoto = user.photos[0]?.url || null;
      const hasVideo = user.videos.length > 0;
      const appealTagNames = user.appealTags.map(tag => tag.appealTag.name);

      return {
        id: user.id,
        name: user.name,
        age,
        location: user.location,
        mainPhoto,
        bio: user.bio,
        hasVideo,
        videoUrl: hasVideo ? user.videos[0].url : null,
        appealTags: appealTagNames
      };
    });
    
    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit),
        currentPage: page,
        limit
      }
    });
    
  } catch (error) {
    console.error('おすすめユーザー取得エラー:', error);
    return NextResponse.json(
      { error: 'ユーザー情報の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
