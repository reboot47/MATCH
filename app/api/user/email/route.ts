import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

export async function PUT(req: NextRequest) {
  try {
    // セッションの取得
    const session = await getServerSession(authOptions);
    console.log('セッション情報:', session);
    
    if (!session || !session.user) {
      console.log('認証エラー: セッションまたはユーザー情報が見つかりません');
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }

    // リクエストボディの取得
    const body = await req.json();
    console.log('リクエストボディ:', body);
    
    // バリデーション
    try {
      emailSchema.parse(body);
    } catch (error) {
      console.log('バリデーションエラー:', error);
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.errors[0].message },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: '入力に誤りがあります' },
        { status: 400 }
      );
    }

    const { email } = body;
    
    // 現在のユーザーIDを取得
    const userId = session.user.id;
    console.log('ユーザーID:', userId);
    
    // 既存のメールアドレスがあるか確認
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log('既存ユーザーチェック:', existingUser);

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に使用されています' },
        { status: 400 }
      );
    }

    // メールアドレスの更新
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { email },
      });
      console.log('更新されたユーザー:', updatedUser);
      
      // 強制的にセッションを無効化してトリガーを発生させる処理
      try {
        // これは直接NextAuthのセッションストアにアクセスするものではなく、
        // 次回のリクエスト時にセッション情報が再生成されるようにするためのヒントです
        const response = new NextResponse(
          JSON.stringify({ message: 'メールアドレスが更新されました' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

        // Cookieの設定
        response.cookies.set('next-auth.session-token', '', { 
          maxAge: 0,
          path: '/'
        });
        
        return response;
      } catch (e) {
        console.error('セッション無効化エラー:', e);
      }
    } catch (prismaError) {
      console.error('Prismaエラー:', prismaError);
      return NextResponse.json(
        { error: 'データベース更新エラー: ' + (prismaError as Error).message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'メールアドレスが更新されました' },
      { status: 200 }
    );
  } catch (error) {
    console.error('メールアドレス更新エラー:', error);
    return NextResponse.json(
      { error: 'メールアドレスの更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
