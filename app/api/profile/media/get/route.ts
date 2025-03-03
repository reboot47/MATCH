import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

// ユーザーのメディアアイテムを取得するエンドポイント
export async function GET(req: NextRequest) {
  try {
    console.log('Media GET API endpoint called');
    
    // 認証を取得
    const session = await auth();
    
    // セッション情報のデバッグ
    console.log('Session in GET API:', session ? {
      userId: session.user?.id,
      userEmail: session.user?.email,
      expires: session.expires
    } : 'No session');
    
    // セッションヘッダーのデバッグ
    console.log('Request headers:', {
      cookie: req.headers.get('cookie') ? 'Present' : 'Not present',
      authorization: req.headers.get('authorization') ? 'Present' : 'Not present'
    });
    
    if (!session || !session.user.id) {
      console.log('Authentication failed - no valid session');
      return NextResponse.json(
        { error: '認証されていません' }, 
        { status: 401 }
      );
    }
    
    console.log('User authenticated:', session.user.id);
    
    // ユーザーのメディアを取得（順番に並べる）
    const mediaItems = await db.mediaItem.findMany({
      where: { userId: session.user.id },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log(`Found ${mediaItems.length} media items for user ${session.user.id}`);
    
    return NextResponse.json(
      { success: true, mediaItems }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('メディア取得エラー:', error);
    return NextResponse.json(
      { error: 'メディアの取得に失敗しました', details: error.message }, 
      { status: 500 }
    );
  }
}
