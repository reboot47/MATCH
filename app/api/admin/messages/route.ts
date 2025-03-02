import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Prismaクライアントのインスタンス化
const prisma = new PrismaClient();

// BigInt to JSON Serialization
BigInt.prototype.toJSON = function() {
  return this.toString();
};

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/messages がリクエストされました');
    
    // 認証チェックを一時的にコメントアウト（デバッグ用）
    /*
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }
    */

    // クエリパラメータを取得
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId');
    const matchId = searchParams.get('matchId');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const filterType = searchParams.get('filterType') || 'all';

    console.log('🔍 クエリパラメータ:', { search, page, limit, userId, matchId, sortBy, sortOrder, filterType });

    // スキップ値を計算
    const skip = (page - 1) * limit;

    // 検索条件を構築
    const whereClause: any = {};
    
    if (search) {
      whereClause.content = {
        contains: search,
        mode: 'insensitive'
      };
    }

    if (userId) {
      whereClause.OR = [
        { senderId: userId },
        { receiverId: userId }
      ];
    }

    if (matchId) {
      whereClause.matchId = matchId;
    }

    if (filterType === 'flagged') {
      whereClause.isFlagged = true;
    } else if (filterType === 'blocked') {
      whereClause.isBlocked = true;
    }

    console.log('🔍 検索条件:', whereClause);

    try {
      // データベース接続テスト
      console.log('🔌 データベース接続テスト開始...');
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ データベース接続成功');
      
      // テーブル一覧確認
      const tables = await prisma.$queryRaw`
        SELECT tablename FROM pg_catalog.pg_tables 
        WHERE schemaname = 'public';
      `;
      console.log(`📋 データベーステーブル一覧: ${(tables as any[]).map((t: any) => t.tablename).join(', ')}`);
      
      // メッセージ総数を取得
      const totalCount = await prisma.message.count({
        where: whereClause,
      });
      
      console.log(`📊 メッセージ総数: ${totalCount}`);

      if (totalCount === 0) {
        console.log('⚠️ メッセージが見つかりませんでした');
        // メッセージが0件の場合でも正常レスポンスを返す
        return NextResponse.json({
          messages: [],
          pagination: {
            total: 0,
            page,
            limit,
            pages: 0
          }
        });
      }

      // ソート条件の設定
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;

      // メッセージデータを取得
      console.log('🔍 メッセージを取得中...');
      
      const messages = await prisma.message.findMany({
        where: whereClause,
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          read: true,
          isFlagged: true,
          isBlocked: true,
          blockReason: true,
          senderId: true,
          receiverId: true,
          matchId: true,
        },
        orderBy,
        skip,
        take: limit,
      });

      console.log(`📊 取得したメッセージ数: ${messages.length}`);
      
      // 関連するユーザーのIDを収集
      const userIds = Array.from(new Set(
        messages.flatMap(msg => [msg.senderId, msg.receiverId])
      ));
      
      // ユーザー情報を取得
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userIds
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      });
      
      // ユーザーIDとユーザー情報のマッピング
      const userMap = Object.fromEntries(
        users.map(user => [user.id, user])
      );
      
      // メッセージにユーザー情報を付与
      const enrichedMessages = messages.map(message => {
        return {
          ...message,
          sender: userMap[message.senderId] || { id: message.senderId, name: 'Unknown User' },
          receiver: userMap[message.receiverId] || { id: message.receiverId, name: 'Unknown User' },
        };
      });

      if (enrichedMessages.length > 0) {
        console.log('📝 最初のメッセージサンプル:', { 
          id: enrichedMessages[0].id, 
          content: enrichedMessages[0].content.substring(0, 20) + '...',
          sender: enrichedMessages[0].sender?.name
        });
      }

      return NextResponse.json({
        messages: enrichedMessages,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit)
        }
      });

    } catch (dbError) {
      console.error('❌ データベースアクセスエラー:', dbError);
      return NextResponse.json(
        { error: 'メッセージの取得に失敗しました', details: dbError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ メッセージ取得APIエラー:', error);
    return NextResponse.json(
      { error: 'メッセージの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * 特定のメッセージを更新するPATCHハンドラ
 */
export async function PATCH(request: NextRequest) {
  try {
    console.log('🔄 PATCH /api/admin/messages がリクエストされました');
    
    // リクエストボディの取得
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "メッセージIDが必要です" },
        { status: 400 }
      );
    }

    console.log('📝 更新リクエスト:', { id, ...updateData });

    // 更新可能なフィールドのホワイトリスト
    const allowedFields = ['content', 'read', 'isFlagged', 'isBlocked', 'blockReason'];
    const filteredUpdateData: any = {};

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    console.log('🔄 フィルタリングされた更新データ:', filteredUpdateData);

    // メッセージの更新
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: filteredUpdateData,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        read: true,
        isFlagged: true,
        isBlocked: true,
        blockReason: true,
        senderId: true,
        receiverId: true,
        matchId: true,
      }
    });

    console.log('✅ メッセージが更新されました:', updatedMessage);

    return NextResponse.json(updatedMessage);

  } catch (error) {
    console.error('❌ メッセージ更新APIエラー:', error);
    return NextResponse.json(
      { error: "メッセージの更新中にエラーが発生しました", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * 特定のメッセージを削除するDELETEハンドラ
 */
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ DELETE /api/admin/messages がリクエストされました');
    
    // URLからメッセージIDを取得
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "メッセージIDが必要です" },
        { status: 400 }
      );
    }

    console.log('🗑️ 削除リクエスト:', { id });

    // メッセージの削除
    await prisma.message.delete({
      where: { id }
    });

    console.log('✅ メッセージが削除されました:', { id });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ メッセージ削除APIエラー:', error);
    return NextResponse.json(
      { error: "メッセージの削除中にエラーが発生しました", details: error.message },
      { status: 500 }
    );
  }
}
