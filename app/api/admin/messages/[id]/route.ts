import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 PATCH /api/admin/messages/${params.id} がリクエストされました`);
    
    // 管理者権限チェック
    const authResult = await checkAdminAccess();
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    // リクエストボディからデータを取得
    const data = await request.json();
    console.log('📝 更新データ:', data);
    
    // IDを取得
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: 'メッセージIDが指定されていません' },
        { status: 400 }
      );
    }
    
    // メッセージの存在を確認
    const existingMessage = await prisma.message.findUnique({
      where: { id }
    });
    
    if (!existingMessage) {
      console.log(`❌ メッセージが見つかりません: ${id}`);
      return NextResponse.json(
        { error: '指定されたメッセージが見つかりません' },
        { status: 404 }
      );
    }
    
    // 更新可能なフィールドを定義
    const updatableFields = ['content', 'read', 'isFlagged', 'isBlocked', 'blockReason', 'adminMemo'];
    
    // 更新データを構築
    const updateData: any = {};
    for (const field of updatableFields) {
      if (field in data) {
        updateData[field] = data[field];
      }
    }
    
    // 更新するデータがない場合
    if (Object.keys(updateData).length === 0) {
      console.log('⚠️ 更新するデータがありません');
      return NextResponse.json(
        { error: '更新するデータが指定されていません' },
        { status: 400 }
      );
    }
    
    // メッセージを更新
    console.log(`🔄 メッセージを更新中... ID: ${id}`);
    console.log('更新データ:', updateData);
    
    try {
      const updatedMessage = await prisma.message.update({
        where: { id },
        data: updateData,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      });
      
      console.log('✅ メッセージの更新が完了しました');
      return NextResponse.json(updatedMessage);
      
    } catch (dbError) {
      console.error('❌ データベース更新エラー:', dbError);
      return NextResponse.json(
        { error: 'メッセージの更新に失敗しました', details: dbError.message },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('❌ メッセージ更新APIエラー:', error);
    return NextResponse.json(
      { error: 'メッセージの更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🗑️ DELETE /api/admin/messages/${params.id} がリクエストされました`);
    
    // 管理者権限チェック
    const authResult = await checkAdminAccess();
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    // IDを取得
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: 'メッセージIDが指定されていません' },
        { status: 400 }
      );
    }
    
    // メッセージの存在を確認
    const existingMessage = await prisma.message.findUnique({
      where: { id }
    });
    
    if (!existingMessage) {
      console.log(`❌ メッセージが見つかりません: ${id}`);
      return NextResponse.json(
        { error: '指定されたメッセージが見つかりません' },
        { status: 404 }
      );
    }
    
    // メッセージを削除
    console.log(`🗑️ メッセージを削除中... ID: ${id}`);
    
    try {
      await prisma.message.delete({
        where: { id }
      });
      
      console.log('✅ メッセージの削除が完了しました');
      return NextResponse.json({ success: true });
      
    } catch (dbError) {
      console.error('❌ データベース削除エラー:', dbError);
      return NextResponse.json(
        { error: 'メッセージの削除に失敗しました', details: dbError.message },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('❌ メッセージ削除APIエラー:', error);
    return NextResponse.json(
      { error: 'メッセージの削除中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// PUT - 個別メッセージの更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 PUT /api/admin/messages/${params.id} がリクエストされました`);
    
    // 管理者権限チェック
    const authResult = await checkAdminAccess();
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const id = params.id;
    
    try {
      const body = await request.json();
      const { isFlagged, isBlocked, blockReason, adminMemo } = body;
      
      // モックデータ（実際の実装ではデータベースから取得して更新）
      const mockUsers = [
        {
          id: '101',
          name: '佐藤健太',
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
          email: 'kenta.sato@example.com'
        },
        {
          id: '102',
          name: '田中美咲',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
          email: 'misaki.tanaka@example.com'
        }
      ];
      
      const mockMessage = {
        id,
        senderId: '101',
        receiverId: '102',
        content: 'こんにちは、お元気ですか？',
        createdAt: '2023-09-15T09:30:00Z',
        isFlagged: isFlagged !== undefined ? isFlagged : false,
        isBlocked: isBlocked !== undefined ? isBlocked : false,
        blockReason: blockReason || null,
        adminMemo: adminMemo !== undefined ? adminMemo : null,
        sender: mockUsers[0],
        receiver: mockUsers[1]
      };
      
      // 実際の実装では以下のようなコードになります
      // const message = await prisma.message.update({
      //   where: { id },
      //   data: {
      //     isFlagged: isFlagged !== undefined ? isFlagged : undefined,
      //     isBlocked: isBlocked !== undefined ? isBlocked : undefined,
      //     blockReason: blockReason !== undefined ? blockReason : undefined,
      //     adminMemo: adminMemo !== undefined ? adminMemo : undefined
      //   },
      //   include: {
      //     sender: true,
      //     receiver: true
      //   }
      // });
      
      return NextResponse.json(mockMessage);
    } catch (error) {
      console.error(`Error updating message ${id}:`, error);
      return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ メッセージ更新APIエラー:', error);
    return NextResponse.json(
      { error: 'メッセージの更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
