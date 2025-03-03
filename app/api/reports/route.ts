import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// 報告作成API
export async function POST(req: NextRequest) {
  try {
    // セッションチェック
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // リクエストボディ取得
    const body = await req.json();
    const { 
      reportedId, 
      type, 
      description, 
      evidenceUrls,
      contentId,
      contentType
    } = body;
    
    // バリデーション
    if (!reportedId || !type || !description) {
      return NextResponse.json(
        { error: '必須項目が不足しています' }, 
        { status: 400 }
      );
    }
    
    // 自分自身の報告防止
    if (reportedId === userId) {
      return NextResponse.json(
        { error: '自分自身を報告することはできません' }, 
        { status: 400 }
      );
    }
    
    // データベースに報告を作成
    const report = await prisma.report.create({
      data: {
        type,
        description,
        reporterId: userId,
        reportedId,
        evidenceUrls: evidenceUrls || [],
        contentId,
        contentType
      }
    });
    
    // 管理者通知作成 (実装例)
    await prisma.notification.create({
      data: {
        type: 'admin_alert',
        content: `新しい${type}の報告が届きました。確認してください。`,
        userId: 'ADMIN_ID', // システム管理者ID
      }
    });
    
    return NextResponse.json({ 
      message: '報告を受け付けました。ご協力ありがとうございます。',
      reportId: report.id
    }, { status: 201 });
    
  } catch (error) {
    console.error('報告API エラー:', error);
    return NextResponse.json(
      { error: '報告の処理中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}

// ユーザーの報告リスト取得API (自分が送信した報告)
export async function GET(req: NextRequest) {
  try {
    // セッションチェック
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // URLパラメータ取得
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // クエリ条件作成
    const where: any = { reporterId: userId };
    
    if (status) {
      where.status = status;
    }
    
    // 報告取得
    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        reported: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    // 総件数取得
    const total = await prisma.report.count({ where });
    
    return NextResponse.json({
      reports,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('報告リスト取得API エラー:', error);
    return NextResponse.json(
      { error: '報告リストの取得中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}
