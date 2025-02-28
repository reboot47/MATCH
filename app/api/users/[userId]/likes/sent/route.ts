import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 送ったいいねの一覧を取得するAPI
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
    
    // ユーザーが送ったいいねを取得
    const likes = await prisma.like.findMany({
      where: {
        senderId: params.userId,
      },
      include: {
        receiver: {
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
    
    // マッチしているかどうかを確認するために、相手からいいねを受け取っているか確認
    const receivedLikeIds = await prisma.like.findMany({
      where: {
        receiverId: params.userId,
      },
      select: {
        senderId: true
      }
    });
    
    const matchedUserIds = new Set(receivedLikeIds.map(like => like.senderId));
    
    // フロントエンド用にデータを整形
    const formattedLikes = likes.map(like => {
      const user = like.receiver;
      const mainPhoto = user.photos[0]?.url;
      const birthdate = user.birthdate ? new Date(user.birthdate) : null;
      const age = birthdate ? new Date().getFullYear() - birthdate.getFullYear() : null;
      
      return {
        id: user.id,
        name: user.name,
        image: mainPhoto || user.image,
        age,
        location: user.location,
        likeDate: like.createdAt,
        isMatched: matchedUserIds.has(user.id)
      };
    });
    
    return NextResponse.json(formattedLikes);
    
  } catch (error) {
    console.error('送ったいいね取得エラー:', error);
    return NextResponse.json(
      { error: 'いいねの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
