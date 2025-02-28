import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 写真・動画の並び順を更新するAPI
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }
    
    const userId = session.user.id as string;
    const { photos } = await request.json();
    
    if (!photos || !Array.isArray(photos)) {
      return new NextResponse(JSON.stringify({ error: '写真・動画データが正しくありません' }), {
        status: 400,
      });
    }
    
    // トランザクションで一括更新
    const result = await prisma.$transaction(
      photos.map((photo, index) => 
        prisma.photo.update({
          where: {
            id: photo.id,
            userId: userId,  // 必ず自分の写真のみを更新
          },
          data: {
            displayOrder: index,
          },
        })
      )
    );
    
    console.log(`${result.length}枚の写真・動画の表示順を更新しました`);
    
    return new NextResponse(JSON.stringify({ 
      success: true, 
      message: '写真・動画の表示順を更新しました', 
      updatedCount: result.length 
    }), {
      status: 200,
    });
  } catch (error) {
    console.error('写真・動画の並べ替えエラー:', error);
    return new NextResponse(JSON.stringify({ error: '写真・動画の表示順の更新中にエラーが発生しました' }), {
      status: 500,
    });
  }
}
