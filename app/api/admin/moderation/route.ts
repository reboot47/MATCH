import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// 管理者権限チェック関数
async function checkAdminAccess(session: any) {
  if (!session?.user) {
    return false;
  }
  
  const userRole = session.user.role;
  return userRole === 'ADMIN' || userRole === 'OPERATOR';
}

// モデレーション対象コンテンツ一覧取得API
export async function GET(req: NextRequest) {
  try {
    // セッションチェック
    const session = await auth();
    
    if (!(await checkAdminAccess(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // URLパラメータ取得
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    const contentType = searchParams.get('contentType');
    const searchTerm = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // クエリ条件作成
    const where: any = { status };
    
    if (contentType) {
      where.contentType = contentType;
    }
    
    // コンテンツモデレーション取得
    const moderations = await prisma.contentModeration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
    
    // 統計情報取得
    const pending = await prisma.contentModeration.count({
      where: { status: 'pending' }
    });
    
    const approved = await prisma.contentModeration.count({
      where: { status: 'approved' }
    });
    
    const rejected = await prisma.contentModeration.count({
      where: { status: 'rejected' }
    });
    
    // 報告一覧の取得
    const reports = await prisma.report.findMany({
      where: {
        status: 'pending'
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
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
    const total = await prisma.contentModeration.count({ where });
    
    return NextResponse.json({
      moderations,
      reports,
      stats: {
        pending,
        approved,
        rejected,
        total: pending + approved + rejected
      },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('モデレーションリスト取得API エラー:', error);
    return NextResponse.json(
      { error: 'モデレーションリストの取得中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}

// モデレーション決定API
export async function POST(req: NextRequest) {
  try {
    // セッションチェック
    const session = await auth();
    
    if (!(await checkAdminAccess(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const moderatorId = session.user.id;
    
    // リクエストボディ取得
    const body = await req.json();
    const { 
      contentId,
      contentType,
      userId,
      status,
      reason,
      moderationNotes,
      violationLevel,
      actionTaken,
      reportId
    } = body;
    
    // バリデーション
    if (!contentId || !contentType || !userId || !status) {
      return NextResponse.json(
        { error: '必須項目が不足しています' }, 
        { status: 400 }
      );
    }
    
    // トランザクション開始
    const result = await prisma.$transaction(async (tx) => {
      // モデレーション記録作成/更新
      const moderation = await tx.contentModeration.upsert({
        where: {
          id: body.moderationId || 'new-moderation',
        },
        create: {
          contentId,
          contentType,
          userId,
          moderatorId,
          status,
          reason,
          moderationNotes,
          violationLevel,
          actionTaken,
          moderatedAt: new Date(),
        },
        update: {
          status,
          reason,
          moderationNotes,
          violationLevel,
          actionTaken,
          moderatorId,
          moderatedAt: new Date(),
        },
      });
      
      // 関連する報告がある場合は更新
      if (reportId) {
        await tx.report.update({
          where: { id: reportId },
          data: {
            status: status === 'approved' ? 'resolved' : 'investigating',
            moderatorId,
            moderationComment: moderationNotes,
            moderatedAt: new Date(),
          }
        });
      }
      
      // コンテンツタイプに応じた処理
      switch (contentType) {
        case 'message':
          // メッセージの場合
          if (status === 'rejected') {
            await tx.message.update({
              where: { id: contentId },
              data: {
                isFlagged: true,
                isBlocked: true,
                blockReason: reason
              }
            });
          } else {
            await tx.message.update({
              where: { id: contentId },
              data: {
                isFlagged: false,
                isBlocked: false,
                blockReason: null
              }
            });
          }
          break;
          
        case 'photo':
          // 写真の場合
          if (status === 'rejected') {
            // 写真削除などの処理
            await tx.photo.delete({
              where: { id: contentId }
            });
          }
          break;
          
        // その他のコンテンツタイプに対する処理
      }
      
      // 対象ユーザーへの通知
      if (status === 'rejected') {
        await tx.notification.create({
          data: {
            type: 'moderation_alert',
            content: `あなたの${contentType}コンテンツが規約違反のため削除されました。理由: ${reason}`,
            userId,
          }
        });
      }
      
      return moderation;
    });
    
    return NextResponse.json({
      message: 'モデレーション決定が処理されました',
      moderation: result
    }, { status: 200 });
    
  } catch (error) {
    console.error('モデレーション決定API エラー:', error);
    return NextResponse.json(
      { error: 'モデレーション決定の処理中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}
