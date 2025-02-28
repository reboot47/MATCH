import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 特定のユーザーをお気に入りに登録しているかを確認するAPI
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
    
    // お気に入りの存在確認
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: params.userId,
        targetId: params.targetId
      }
    });
    
    return NextResponse.json({
      isFavorited: !!favorite
    });
    
  } catch (error) {
    console.error('お気に入り確認エラー:', error);
    return NextResponse.json(
      { error: 'お気に入りの確認中にエラーが発生しました', isFavorited: false },
      { status: 500 }
    );
  }
}
