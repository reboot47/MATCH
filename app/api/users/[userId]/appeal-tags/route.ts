import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// アピールタグの更新
export async function PUT(
  request: Request,
  context: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session) {
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }
    
    const { userId } = context.params;
    
    // ユーザーIDのチェック
    if (session.user.id !== userId) {
      return new NextResponse(JSON.stringify({ error: '権限がありません' }), {
        status: 403,
      });
    }
    
    const body = await request.json();
    const { appealTags } = body;
    
    if (!Array.isArray(appealTags)) {
      return new NextResponse(JSON.stringify({ error: 'アピールタグは配列である必要があります' }), {
        status: 400,
      });
    }
    
    // 最大5つまでのタグに制限
    const tagsToProcess = appealTags.slice(0, 5);
    
    // まず現在のタグを削除
    await prisma.userAppealTag.deleteMany({
      where: { userId }
    });
    
    // 新しいタグを処理
    const processedTags = [];
    
    for (const tagName of tagsToProcess) {
      // タグを取得または作成
      let appealTag = await prisma.appealTag.findFirst({
        where: { name: tagName }
      });
      
      if (!appealTag) {
        appealTag = await prisma.appealTag.create({
          data: { name: tagName }
        });
      }
      
      // ユーザーとタグの関連付け
      await prisma.userAppealTag.create({
        data: {
          userId,
          appealTagId: appealTag.id
        }
      });
      
      processedTags.push(appealTag.name);
    }
    
    return NextResponse.json({
      message: 'アピールタグを更新しました',
      appealTags: processedTags
    });
  } catch (error) {
    console.error('アピールタグ更新エラー:', error);
    return new NextResponse(JSON.stringify({ error: 'サーバーエラーが発生しました' }), {
      status: 500,
    });
  }
}
