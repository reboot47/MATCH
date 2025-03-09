import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { validateSession } from '@/lib/auth/session-helper';

// デバッグモード設定
const DEBUG_MODE = process.env.NODE_ENV === 'development';
const RETURN_MOCK_ON_ERROR = true; // APIエラー時にモックデータを返す

// モックメディアデータを生成する関数
function createMockMediaItems(cause?: string) {
  return [
    {
      id: 'mock-media-1',
      userId: 'mock-user-id',
      url: 'https://res.cloudinary.com/dslf46nht/image/upload/v1694789345/linebuzz/demo/photo1.jpg',
      type: 'image',
      caption: `APIエラー（${cause || '認証エラー'}）によるモックデータ 1`,
      isPrimary: true,
      publicId: 'mock-public-id-1',
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'mock-media-2',
      userId: 'mock-user-id',
      url: 'https://res.cloudinary.com/dslf46nht/image/upload/v1694789345/linebuzz/demo/photo2.jpg',
      type: 'image',
      caption: `APIエラー（${cause || '認証エラー'}）によるモックデータ 2`,
      publicId: 'mock-public-id-2',
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
}

// ユーザーのメディアアイテムを取得するエンドポイント
export async function GET(req: NextRequest) {
  // リクエスト情報の記録
  const requestId = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  
  try {
    console.log(`[Media GET API] Request ${requestId}: Endpoint called`);
    
    // 認証を取得
    const session = await auth();
    
    // セッション情報のデバッグ
    console.log(`[Media GET API] Session ${requestId}:`, session ? {
      userId: session.user?.id,
      userEmail: session.user?.email,
      expires: session.expires
    } : 'No session');
    
    // セッションヘッダーのデバッグ
    console.log(`[Media GET API] Request headers ${requestId}:`, {
      cookie: req.headers.get('cookie') ? 'Present' : 'Not present',
      authorization: req.headers.get('authorization') ? 'Present' : 'Not present'
    });
    
    // セッション検証
    const sessionValidation = validateSession(session);
    console.log(`[Media GET API] Session validation ${requestId}:`, 
      JSON.stringify({
        isValid: sessionValidation.isValid,
        reason: sessionValidation.reason || 'Valid',
        userId: session?.user?.id,
        expires: session?.expires
      })
    );
    
    if (!sessionValidation.isValid) {
      console.log(`[Media GET API] Auth error ${requestId}: ${sessionValidation.reason}`);
      
      // デバッグモードかつモックデータを返す設定の場合
      if (DEBUG_MODE && RETURN_MOCK_ON_ERROR) {
        console.log(`[Media GET API] Debug mode ${requestId}: Returning mock data`);
        const mockMedia = createMockMediaItems('認証');
        return NextResponse.json(
          { success: true, mediaItems: mockMedia }, 
          { 
            status: 200,
            headers: {
              'X-Mock-Data': 'true',
              'X-Auth-Error': sessionValidation.reason || 'Session validation failed',
              'X-Request-ID': requestId
            }
          }
        );
      }
      
      return NextResponse.json(
        { error: sessionValidation.reason || '認証されていません' }, 
        { 
          status: 401,
          headers: { 'X-Request-ID': requestId }
        }
      );
    }
    
    console.log(`[Media GET API] User authenticated ${requestId}:`, session.user.id);
    
    // ユーザーのメディアを取得（順番に並べる）
    const mediaItems = await db.mediaItem.findMany({
      where: { userId: session.user.id },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log(`[Media GET API] Found ${mediaItems.length} media items ${requestId} for user ${session.user.id}`);
    
    return NextResponse.json(
      { success: true, mediaItems }, 
      { 
        status: 200,
        headers: { 'X-Request-ID': requestId }
      }
    );
  } catch (error) {
    console.error(`[Media GET API] Error ${requestId}:`, error);
    
    // デバッグモードかつモックデータを返す設定の場合
    if (DEBUG_MODE && RETURN_MOCK_ON_ERROR) {
      console.log(`[Media GET API] Debug mode ${requestId}: Returning mock data after error`);
      const mockMedia = createMockMediaItems('サーバーエラー');
      return NextResponse.json(
        { success: true, mediaItems: mockMedia }, 
        { 
          status: 200,
          headers: {
            'X-Mock-Data': 'true',
            'X-Error': 'Internal server error',
            'X-Request-ID': requestId
          }
        }
      );
    }
    
    return NextResponse.json(
      { error: 'メディアの取得に失敗しました', details: error.message }, 
      { 
        status: 500,
        headers: { 'X-Request-ID': requestId }
      }
    );
  }
}
