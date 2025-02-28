import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 特定のユーザーにいいねしているかを確認するAPI
export async function GET(
  request: Request,
  { params }: { params: { userId: string, targetId: string } }
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
    
    // いいねの存在確認
    const like = await prisma.like.findFirst({
      where: {
        senderId: params.userId,
        receiverId: params.targetId
      }
    });
    
    return NextResponse.json({
      isLiked: !!like
    });
    
  } catch (error) {
    console.error('いいね確認エラー:', error);
    return NextResponse.json(
      { error: 'いいねの確認中にエラーが発生しました', isLiked: false },
      { status: 500 }
    );
  }
}
