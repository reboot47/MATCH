import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 足あとを記録するAPI
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }
    
    const { visitedId } = await request.json();
    
    if (!visitedId) {
      return NextResponse.json(
        { error: '訪問先ユーザーIDが必要です' },
        { status: 400 }
      );
    }
    
    // 自分のプロフィールへのアクセスは記録しない
    if (session.user.id === visitedId) {
      return NextResponse.json(
        { message: '自分のプロフィールへのアクセスは記録されません' },
        { status: 200 }
      );
    }
    
    // 過去24時間以内の足あとを確認
    const past24Hours = new Date();
    past24Hours.setHours(past24Hours.getHours() - 24);
    
    const recentFootprint = await prisma.footprint.findFirst({
      where: {
        visitorId: session.user.id,
        visitedId: visitedId,
        visitDate: {
          gte: past24Hours
        }
      }
    });
    
    // 同じユーザーへの24時間以内のアクセスは更新のみ行う
    if (recentFootprint) {
      await prisma.footprint.update({
        where: {
          id: recentFootprint.id
        },
        data: {
          visitDate: new Date()
        }
      });
      
      return NextResponse.json({
        message: '足あとを更新しました'
      });
    }
    
    // 新しい足あとを作成
    const footprint = await prisma.footprint.create({
      data: {
        visitorId: session.user.id,
        visitedId: visitedId,
        visitDate: new Date()
      }
    });
    
    // 足あと通知を作成
    await prisma.notification.create({
      data: {
        userId: visitedId,
        content: '新しい足あとがあります',
        type: 'footprint',
        isRead: false
      }
    });
    
    return NextResponse.json({
      message: '足あとを記録しました'
    });
    
  } catch (error) {
    console.error('足あと記録エラー:', error);
    return NextResponse.json(
      { error: '足あとの記録中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
