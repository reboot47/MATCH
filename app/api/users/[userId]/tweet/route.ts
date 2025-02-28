import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// つぶやきの更新
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session) {
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }
    
    const userId = params.userId;
    
    // ユーザーIDのチェック
    if (session.user.id !== userId) {
      return new NextResponse(JSON.stringify({ error: '権限がありません' }), {
        status: 403,
      });
    }
    
    const body = await request.json();
    const { tweet } = body;
    
    if (tweet === undefined) {
      return new NextResponse(JSON.stringify({ error: 'つぶやきが必要です' }), {
        status: 400,
      });
    }
    
    // つぶやきの更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { tweet },
    });
    
    return NextResponse.json({ 
      success: true, 
      tweet: updatedUser.tweet 
    });
  } catch (error) {
    console.error('つぶやき更新エラー:', error);
    return new NextResponse(JSON.stringify({ error: 'サーバーエラーが発生しました' }), {
      status: 500,
    });
  }
}
