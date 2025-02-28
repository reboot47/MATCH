import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// お気に入りの取得・追加・削除を行うAPI
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session || session.user.id !== params.userId) {
      return NextResponse.json(
        { error: '認証されていないか、権限がありません' },
        { status: 401 }
      );
    }
    
    // お気に入りの一覧を取得
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: params.userId,
      },
      include: {
        target: {
          select: {
            id: true,
            name: true,
            image: true,
            birthdate: true,
            location: true,
            photos: {
              where: {
                isMain: true
              },
              select: {
                url: true
              }
            },
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // フロントエンド用にデータを整形
    const formattedFavorites = favorites.map(favorite => {
      const user = favorite.target;
      const mainPhoto = user.photos[0]?.url;
      const birthdate = user.birthdate ? new Date(user.birthdate) : null;
      const age = birthdate ? new Date().getFullYear() - birthdate.getFullYear() : null;
      
      return {
        id: user.id,
        name: user.name,
        image: mainPhoto || user.image,
        age,
        location: user.location,
        favoriteDate: favorite.createdAt
      };
    });
    
    return NextResponse.json(formattedFavorites);
    
  } catch (error) {
    console.error('お気に入り取得エラー:', error);
    return NextResponse.json(
      { error: 'お気に入りの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// お気に入りに追加
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session || session.user.id !== params.userId) {
      return NextResponse.json(
        { error: '認証されていないか、権限がありません' },
        { status: 401 }
      );
    }
    
    const { targetId } = await request.json();
    
    if (!targetId) {
      return NextResponse.json(
        { error: '対象ユーザーIDが必要です' },
        { status: 400 }
      );
    }
    
    // 既にお気に入りが存在するか確認
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: params.userId,
        targetId: targetId
      }
    });
    
    if (existingFavorite) {
      return NextResponse.json(
        { message: '既にお気に入りに追加されています' },
        { status: 200 }
      );
    }
    
    // お気に入りを作成
    const favorite = await prisma.favorite.create({
      data: {
        userId: params.userId,
        targetId: targetId
      }
    });
    
    return NextResponse.json({
      message: 'お気に入りに追加しました'
    });
    
  } catch (error) {
    console.error('お気に入り追加エラー:', error);
    return NextResponse.json(
      { error: 'お気に入りの追加中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// お気に入りから削除
export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session || session.user.id !== params.userId) {
      return NextResponse.json(
        { error: '認証されていないか、権限がありません' },
        { status: 401 }
      );
    }
    
    const { targetId } = await request.json();
    
    if (!targetId) {
      return NextResponse.json(
        { error: '対象ユーザーIDが必要です' },
        { status: 400 }
      );
    }
    
    // お気に入りの削除
    await prisma.favorite.deleteMany({
      where: {
        userId: params.userId,
        targetId: targetId
      }
    });
    
    return NextResponse.json({
      message: 'お気に入りから削除しました'
    });
    
  } catch (error) {
    console.error('お気に入り削除エラー:', error);
    return NextResponse.json(
      { error: 'お気に入りの削除中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
