import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// いいねを送信するAPI
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
    
    const { receiverId } = await request.json();
    
    if (!receiverId) {
      return NextResponse.json(
        { error: '受信者IDが必要です' },
        { status: 400 }
      );
    }
    
    // 自分自身へのいいねはできない
    if (receiverId === params.userId) {
      return NextResponse.json(
        { error: '自分自身にいいねはできません' },
        { status: 400 }
      );
    }
    
    // 既にいいねが存在するか確認
    const existingLike = await prisma.like.findFirst({
      where: {
        senderId: params.userId,
        receiverId: receiverId
      }
    });
    
    if (existingLike) {
      return NextResponse.json(
        { message: '既にいいねしています', isMatched: false },
        { status: 200 }
      );
    }
    
    // いいねを作成
    const like = await prisma.like.create({
      data: {
        senderId: params.userId,
        receiverId: receiverId
      }
    });
    
    // マッチングをチェック（相手からのいいねが存在するか）
    const mutualLike = await prisma.like.findFirst({
      where: {
        senderId: receiverId,
        receiverId: params.userId
      }
    });
    
    const isMatched = !!mutualLike;
    
    // マッチした場合は通知を作成
    if (isMatched) {
      // 自分への通知
      await prisma.notification.create({
        data: {
          userId: params.userId,
          content: 'マッチングが成立しました！メッセージを送ってみましょう',
          type: 'match',
          isRead: false
        }
      });
      
      // 相手への通知
      await prisma.notification.create({
        data: {
          userId: receiverId,
          content: 'マッチングが成立しました！メッセージを送ってみましょう',
          type: 'match',
          isRead: false
        }
      });
    } else {
      // マッチしていない場合は、相手にいいね通知を送る
      await prisma.notification.create({
        data: {
          userId: receiverId,
          content: '新しいいいねがあります',
          type: 'like',
          isRead: false
        }
      });
    }
    
    return NextResponse.json({
      message: 'いいねを送信しました',
      isMatched
    });
    
  } catch (error) {
    console.error('いいね送信エラー:', error);
    return NextResponse.json(
      { error: 'いいねの送信中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
