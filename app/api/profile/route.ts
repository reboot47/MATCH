import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { validateSession } from '@/lib/auth/session-helper';

// デバッグモード設定
const DEBUG_MODE = process.env.NODE_ENV === 'development';
const RETURN_MOCK_ON_ERROR = true; // APIエラー時にモックデータを返す

/**
 * 安全なエラーオブジェクトを生成
 */
function createSafeError(err: any, context: string): Error {
  if (!err) {
    return new Error(`${context}: 不明なエラー（エラーオブジェクトがnull/undefined）`);
  }
  
  if (typeof err === 'string') {
    return new Error(`${context}: ${err}`);
  }
  
  if (err instanceof Error) {
    // すでにErrorオブジェクトならそのまま返す
    return err;
  }
  
  // オブジェクトだが、Errorインスタンスではない場合
  // 日本語文字をエンコードするための安全な対応
  let errorMessage;
  try {
    errorMessage = err.message || `${context}: 詳細不明のエラー`;
  } catch (encodeError) {
    errorMessage = `${context}: エンコードエラー`;
  }
  
  const safeError = new Error(errorMessage);
  
  // 元のオブジェクトのプロパティをコピー(エンコードエラーを回避)
  try {
    Object.keys(err).forEach(key => {
      try {
        (safeError as any)[key] = err[key];
      } catch (propError) {
        // プロパティのコピーに失敗しても続行
      }
    });
  } catch (objError) {
    // オブジェクトの処理に失敗しても続行
  }
  
  return safeError;
}

// モックユーザーデータを生成する関数
function createMockUserData(userId: string, email?: string, name?: string, cause?: string) {
  return {
    id: userId || 'error-user',
    name: name || 'エラーユーザー',
    email: email || 'error@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    bio: cause 
      ? `これはAPI ${cause}エラーによる代替（モック）データです。`
      : 'これはAPIエラーによる代替（モック）データです。実際のデータベースとの接続に問題があります。',
    age: 30,
    gender: '未設定',
    location: '東京',
    occupation: 'エンジニア',
    company: 'テック企業',
    education: '大学',
    height: 170,
    drinking: 'sometimes',
    smoking: 'never',
    children: 0,
    interests: ['テクノロジー', 'デバッグ', 'トラブルシューティング'],
    createdAt: new Date(),
    updatedAt: new Date(),
    mediaItems: [],
    emailVerified: null,
    isMockData: true, // これはモックデータであることを示すフラグ
    mockCause: cause || 'unknown' // モックデータが返された原因
  };
}

// プロフィール情報取得エンドポイント
export async function GET(req: NextRequest) {
  // リクエスト情報の記録
  const requestId = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  const requestInfo = {
    id: requestId,
    url: req.url,
    method: req.method,
    time: new Date().toISOString(),
    headers: Object.fromEntries(
      [...req.headers.entries()].filter(([key]) => 
        !['cookie', 'authorization'].includes(key.toLowerCase())
      )
    )
  };
  
  console.log(`[Profile API] Request ${requestId}:`, JSON.stringify(requestInfo));
  
  try {
    // 認証を確認
    const session = await auth();
    
    // セッション検証
    const sessionValidation = validateSession(session);
    console.log(`[Profile API] Session validation ${requestId}:`, 
      JSON.stringify({
        isValid: sessionValidation.isValid,
        reason: sessionValidation.reason || 'Valid',
        userId: session?.user?.id,
        expires: session?.expires
      })
    );
    
    if (!sessionValidation.isValid) {
      console.log(`[Profile API] Auth error ${requestId}: ${sessionValidation.reason}`);
      
      // デバッグモードかつモックデータを返す設定の場合
      if (DEBUG_MODE && RETURN_MOCK_ON_ERROR) {
        console.log(`[Profile API] Debug mode ${requestId}: Returning mock data`);
        try {
          const mockUser = createMockUserData(
            'error-user', 
            'error@example.com', 
            'Error User',
            'auth'
          );
          return NextResponse.json(mockUser, { 
            status: 200,
            headers: {
              'X-Mock-Data': 'true',
              'X-Auth-Error': sessionValidation.reason || 'Session validation failed',
              'X-Request-ID': requestId
            }
          });
        } catch (mockError) {
          console.error(`[Profile API] Fatal error ${requestId}: ${mockError}`);
          return NextResponse.json(
            { 
              error: 'Authentication error',
              mockData: true,
              id: 'error-user' 
            }, 
            { 
              status: 200,
              headers: {
                'X-Mock-Data': 'true',
                'X-Fatal-Error': mockError instanceof Error ? mockError.message : 'Unknown error',
                'X-Request-ID': requestId
              }
            }
          );
        }
      }
      
      return NextResponse.json(
        { error: sessionValidation.reason || '認証されていません' }, 
        { 
          status: 401,
          headers: { 'X-Request-ID': requestId }
        }
      );
    }
    
    // ユーザー情報を取得
    console.log(`[Profile API] Fetching user data ${requestId}: ${session.user.id}`);
    try {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
          mediaItems: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
      
      if (!user) {
        console.log(`[Profile API] User not found ${requestId}: ${session.user.id}`);
        
        // デバッグモードかつモックデータを返す設定の場合
        if (DEBUG_MODE && RETURN_MOCK_ON_ERROR) {
          console.log(`[Profile API] Debug mode ${requestId}: Returning mock data for missing user`);
          const mockUser = createMockUserData(
            session.user.id,
            session.user.email as string,
            session.user.name as string,
            'ユーザー未発見'
          );
          return NextResponse.json(mockUser, { 
            status: 200,
            headers: {
              'X-Mock-Data': 'true',
              'X-DB-Error': 'User not found',
              'X-Request-ID': requestId
            }
          });
        }
        
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' }, 
          { 
            status: 404,
            headers: { 'X-Request-ID': requestId }
          }
        );
      }
      
      // パスワードなどの機密情報を削除
      const { hashedPassword, ...safeUser } = user;
      console.log(`[Profile API] Returning profile ${requestId} for user: ${user.id}`);
      
      return NextResponse.json(safeUser, { 
        status: 200,
        headers: { 'X-Request-ID': requestId }
      });
    } catch (dbError: any) {
      const safeError = createSafeError(dbError, 'データベースエラー');
      console.error(`[Profile API] Database error ${requestId}:`, safeError);
      
      // デバッグモードかつモックデータを返す設定の場合
      if (DEBUG_MODE && RETURN_MOCK_ON_ERROR) {
        console.log(`[Profile API] Debug mode ${requestId}: DB error, returning mock data`);
        try {
          const mockUser = createMockUserData(
            session.user.id,
            session.user.email as string,
            'DB Error User',
            'database'
          );
          return NextResponse.json(mockUser, { 
            status: 200,
            headers: {
              'X-Mock-Data': 'true',
              'X-DB-Error': safeError.message || 'Database error',
              'X-Request-ID': requestId
            }
          });
        } catch (mockError) {
          console.error(`[Profile API] Mock data error ${requestId}: ${mockError}`);
          return NextResponse.json(
            { 
              error: 'Database error',
              mockData: true,
              id: session.user.id || 'error-user'
            }, 
            { 
              status: 200, 
              headers: {
                'X-Mock-Data': 'true',
                'X-DB-Error': safeError.message || 'Database error',
                'X-Request-ID': requestId
              }
            }
          );
        }
      }
      
      throw safeError; // 上位のエラーハンドラに渡す
    }
  } catch (error: any) {
    const safeError = createSafeError(error, 'プロフィール取得エラー');
    console.error(`[Profile API] Fatal error ${requestId}:`, safeError);
    
    // デバッグモードかつモックデータを返す設定の場合
    if (DEBUG_MODE && RETURN_MOCK_ON_ERROR) {
      console.log(`[Profile API] Fatal error ${requestId}: Returning mock data`);
      try {
        const mockUser = createMockUserData(
          'error-user', 
          'error@example.com', 
          'Error User',
          'fatal'
        );
        return NextResponse.json(mockUser, { 
          status: 200,
          headers: {
            'X-Mock-Data': 'true',
            'X-Fatal-Error': safeError.message || 'Unknown error',
            'X-Error-Type': safeError.name,
            'X-Request-ID': requestId
          }
        });
      } catch (mockError) {
        console.error(`[Profile API] Fatal mock error ${requestId}: ${mockError}`);
        return NextResponse.json(
          { 
            error: 'Fatal error',
            mockData: true,
            id: 'error-user'
          }, 
          { 
            status: 200,
            headers: {
              'X-Mock-Data': 'true',
              'X-Fatal-Error': safeError.message || 'Unknown error',
              'X-Error-Type': safeError.name,
              'X-Request-ID': requestId
            }
          }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'プロフィール情報の取得に失敗しました', 
        message: DEBUG_MODE ? safeError.message : undefined 
      }, 
      { 
        status: 500,
        headers: { 'X-Request-ID': requestId }
      }
    );
  }
}

// プロフィール情報更新スキーマ
const profileUpdateSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  age: z.union([
    z.number().min(18).max(100),
    z.string().transform(val => {
      // 空文字列の場合はnullに変換（nullを許可）
      if (val === '') return null;
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new Error('年齢は数値で入力してください');
      }
      return parsed;
    })
  ]).optional().nullable(),
  gender: z.string().optional(),
  location: z.string().optional(),
  occupation: z.string().optional(),
  interests: z.array(z.string()).optional(),
  
  // 会社/組織の追加
  company: z.string().optional().nullable(),
  
  // 学歴の追加
  education: z.string().optional().nullable(),
  
  // 身長の追加 (50〜300cm)
  height: z.union([
    z.number().min(50).max(300),
    z.string().transform(val => {
      if (val === '') return null;
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new Error('身長は数値で入力してください');
      }
      if (parsed < 50 || parsed > 300) {
        throw new Error('身長は50〜300cmの間で入力してください');
      }
      return parsed;
    })
  ]).optional().nullable(),
  
  // 飲酒の追加
  drinking: z.string().optional().nullable(),
  
  // 喫煙の追加
  smoking: z.string().optional().nullable(),
  
  // 子供の追加 (0以上の整数)
  children: z.union([
    z.number().min(0).int(),
    z.string().transform(val => {
      if (val === '') return null;
      // 文字列値のままリテラル値として扱うかの判定
      if (['0', '1', '2', '3', '4'].includes(val)) {
        // 数値に変換して返す
        return parseInt(val, 10);
      }
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new Error('子供の数は数値で入力してください');
      }
      if (parsed < 0) {
        throw new Error('子供の数は0以上の値を入力してください');
      }
      return parsed;
    })
  ]).optional().nullable(),
  
  // 性格診断結果
  personalityType: z.string().optional().nullable(),
  personalityTraits: z.record(z.string(), z.number()).optional().nullable(),
  personalityTestCompleted: z.boolean().optional(),
  appealProfile: z.object({
    personalStories: z.array(
      z.object({
        id: z.string(),
        question: z.string(),
        answer: z.string(),
        mediaUrl: z.string().optional(),
        mediaType: z.enum(['image', 'video']).optional(),
        createdAt: z.date().optional()
      })
    ).optional(),
    skills: z.array(
      z.object({
        id: z.string(),
        category: z.string(),
        name: z.string(),
        level: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'professional']),
        description: z.string().optional(),
        mediaUrls: z.array(z.string()).optional()
      })
    ).optional(),
    bucketList: z.array(
      z.object({
        id: z.string(),
        category: z.enum(['travel', 'experience', 'achievement', 'learning', 'other']),
        title: z.string(),
        description: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high']),
        targetDate: z.date().optional(),
        isCompleted: z.boolean(),
        mediaUrl: z.string().optional()
      })
    ).optional(),
    introVideo: z.object({
      id: z.string(),
      url: z.string(),
      thumbnailUrl: z.string(),
      prompt: z.string().optional(),
      transcript: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      duration: z.number(),
      createdAt: z.date().optional()
    }).optional(),
    eventHistory: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        category: z.string(),
        date: z.date(),
        location: z.string().optional(),
        description: z.string().optional(),
        participants: z.string().optional(),
        imageUrl: z.string().optional(),
        createdAt: z.date().optional()
      })
    ).optional(),
    qAndA: z.array(
      z.object({
        id: z.string(),
        question: z.string(),
        answer: z.string(),
        isCustomQuestion: z.boolean().optional(),
        createdAt: z.date().optional()
      })
    ).optional(),
    valueMap: z.object({
      categories: z.record(
        z.string(),
        z.object({
          values: z.record(
            z.string(),
            z.object({
              importance: z.number(),
              description: z.string().optional()
            })
          )
        })
      )
    }).optional()
  }).optional()
});

// プロフィール情報更新エンドポイント
export async function POST(req: NextRequest) {
  // リクエスト情報の記録
  const requestId = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  console.log(`[Profile API] Update request ${requestId}`);

  try {
    // 認証を確認
    const session = await auth();
    
    if (!session || !session.user.id) {
      console.log(`[Profile API] Update auth error ${requestId}: No session`);
      return NextResponse.json(
        { error: '認証されていません' }, 
        { status: 401 }
      );
    }
    
    // リクエストデータを取得
    const body = await req.json();
    
    // バリデーション
    const validation = profileUpdateSchema.safeParse(body);
    if (!validation.success) {
      console.log(`[Profile API] Update validation error ${requestId}:`, validation.error.errors);
      return NextResponse.json(
        { error: '無効なプロフィールデータ', details: validation.error.errors }, 
        { status: 400 }
      );
    }
    
    const validatedData = validation.data;
    console.log(`[Profile API] Updating profile ${requestId} for user: ${session.user.id}`, 
      { fields: Object.keys(validatedData), values: validatedData });
    
    // プロフィール情報を更新
    try {
      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: validatedData,
        include: {
          mediaItems: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
      
      // パスワードなどの機密情報を削除
      const { hashedPassword, ...safeUser } = updatedUser;
      
      console.log(`[Profile API] Profile updated ${requestId} for user: ${session.user.id}`, {
        updatedFields: Object.keys(validatedData),
        responseFields: Object.keys(safeUser)
      });
      
      console.log(`[Profile API] Profile updated ${requestId} for user: ${session.user.id}`);
      return NextResponse.json(
        { 
          success: true, 
          message: 'プロフィールを更新しました', 
          user: safeUser 
        }, 
        { 
          status: 200,
          headers: { 'X-Request-ID': requestId }
        }
      );
    } catch (error) {
      const safeError = createSafeError(error, 'プロフィール更新エラー');
      console.error(`[Profile API] Update error ${requestId}:`, safeError);
      return NextResponse.json(
        { error: 'プロフィール情報の更新に失敗しました', message: DEBUG_MODE ? safeError.message : undefined }, 
        { 
          status: 500,
          headers: { 'X-Request-ID': requestId }
        }
      );
    }
  } catch (error) {
    const safeError = createSafeError(error, 'プロフィール更新エラー');
    console.error(`[Profile API] Update error ${requestId}:`, safeError);
    return NextResponse.json(
      { error: 'プロフィール情報の更新に失敗しました', message: DEBUG_MODE ? safeError.message : undefined }, 
      { 
        status: 500,
        headers: { 'X-Request-ID': requestId }
      }
    );
  }
}
