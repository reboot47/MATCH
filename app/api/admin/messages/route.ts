import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// 安全なJSONProcessing関数
// BigIntを扱う関数を別のユーティリティとして定義
const safeJSONStringify = (obj: any): string => {
  return JSON.stringify(obj, (_, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  });
};

// 管理者権限チェック関数
async function checkAdminAccess() {
  const session = await auth();
  
  if (!session || !session.user) {
    return { authorized: false, error: 'ログインしていません。' };
  }
  
  const userRole = session.user.role;
  
  if (userRole !== 'ADMIN' && userRole !== 'operator') {
    return { authorized: false, error: 'この操作を行う権限がありません。' };
  }
  
  return { authorized: true, error: null };
}

// モックデータ - 実際の実装ではデータベースから取得
let mockMessages = [
  {
    id: '1',
    senderId: '101',
    receiverId: '102',
    content: 'こんにちは、お元気ですか？',
    createdAt: '2023-09-15T09:30:00Z',
    isFlagged: false,
    isBlocked: false,
    sender: {
      id: '101',
      name: '佐藤健太',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      email: 'kenta.sato@example.com'
    },
    receiver: {
      id: '102',
      name: '田中美咲',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      email: 'misaki.tanaka@example.com'
    },
    adminMemo: null
  },
  {
    id: '2',
    senderId: '102',
    receiverId: '101',
    content: 'はい、元気です。あなたは？',
    createdAt: '2023-09-15T09:32:00Z',
    isFlagged: false,
    isBlocked: false,
    sender: {
      id: '102',
      name: '田中美咲',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      email: 'misaki.tanaka@example.com'
    },
    receiver: {
      id: '101',
      name: '佐藤健太',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      email: 'kenta.sato@example.com'
    },
    adminMemo: '継続監視が必要です'
  },
  // ... other mock messages ...
];

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/messages がリクエストされました');
    
    // 管理者権限チェック
    const authResult = await checkAdminAccess();
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

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
      
      // ソート条件の設定（デフォルト: 作成日の降順）
      let orderBy: any = {};
      if (sortBy && ['createdAt', 'updatedAt'].includes(sortBy)) {
        orderBy[sortBy] = sortOrder;
      } else {
        orderBy = { createdAt: 'desc' };
      }
      
      // 代替データの作成（開発用）
      console.log('⚠️ 開発用モックデータを使用します');
      
      // 模擬ユーザー
      const mockUsers = [
        { id: '1', name: 'Admin User', email: 'admin@linebuzz.jp', image: '/images/avatar-1.jpg' },
        { id: '2', name: 'Test User', email: 'test@linebuzz.jp', image: '/images/avatar-2.jpg' },
        { id: '3', name: '運営管理者', email: 'operator@linebuzz.jp', image: '/images/avatar-3.jpg' },
        { id: '4', name: 'Admin User', email: 'admin@linebuzz.com', image: '/images/avatar-4.jpg' }
      ];
      
      // 模擬メッセージ
      const mockMessages = Array.from({ length: 30 }, (_, i) => ({
        id: `msg_${i + 1}`,
        content: `テストメッセージ内容 ${i + 1}`,
        createdAt: new Date(Date.now() - i * 3600000),
        updatedAt: new Date(Date.now() - i * 3600000),
        read: Math.random() > 0.5,
        isFlagged: i % 5 === 0,
        isBlocked: i % 10 === 0,
        blockReason: i % 10 === 0 ? '不適切な内容' : null,
        senderId: mockUsers[i % 2].id,
        receiverId: mockUsers[(i + 1) % 2].id,
        matchId: `match_${Math.floor(i / 3) + 1}`,
        sender: mockUsers[i % 2],
        receiver: mockUsers[(i + 1) % 2],
        adminMemo: null
      }));
      
      // フィルタリング処理
      let filteredMessages = [...mockMessages];
      
      if (search) {
        filteredMessages = filteredMessages.filter(msg => 
          msg.content.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (userId) {
        filteredMessages = filteredMessages.filter(msg => 
          msg.senderId === userId || msg.receiverId === userId
        );
      }
      
      if (matchId) {
        filteredMessages = filteredMessages.filter(msg => 
          msg.matchId === matchId
        );
      }
      
      if (filterType === 'flagged') {
        filteredMessages = filteredMessages.filter(msg => msg.isFlagged);
      } else if (filterType === 'blocked') {
        filteredMessages = filteredMessages.filter(msg => msg.isBlocked);
      }
      
      // ページネーション
      const total = filteredMessages.length;
      const pages = Math.ceil(total / limit);
      
      // ソート
      if (sortOrder === 'asc') {
        filteredMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else {
        filteredMessages.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      
      // ページに該当するデータを取得
      const pagedMessages = filteredMessages.slice(skip, skip + limit);
      
      console.log(`📊 モックメッセージ: 全${total}件中 ${pagedMessages.length}件を返します`);
      
      return NextResponse.json({
        messages: pagedMessages,
        pagination: {
          total,
          page,
          limit,
          pages
        }
      });

    } catch (dbError) {
      console.error('❌ データベースアクセスエラー:', dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : '不明なエラー';
      return NextResponse.json(
        { error: 'メッセージの取得に失敗しました', details: errorMessage },
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
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🔄 PATCH /api/admin/messages がリクエストされました');
    
    // 管理者権限チェック
    const authResult = await checkAdminAccess();
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

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
    const allowedFields = ['content', 'read', 'isFlagged', 'isBlocked', 'blockReason', 'adminMemo'];
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
        matchId: true
        // adminMemoプロパティが型に存在しない場合は削除
        // adminMemo: true
      }
    });

    console.log('✅ メッセージが更新されました:', updatedMessage);

    return NextResponse.json(updatedMessage);

  } catch (error) {
    console.error('❌ メッセージ更新APIエラー:', error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: "メッセージの更新中にエラーが発生しました", details: errorMessage },
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
    
    // 管理者権限チェック
    const authResult = await checkAdminAccess();
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

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
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: "メッセージの削除中にエラーが発生しました", details: errorMessage },
      { status: 500 }
    );
  }
}
