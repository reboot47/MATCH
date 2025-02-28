import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/app/lib/prisma';
import { z } from 'zod';

// 通知設定のスキーマ
const notificationSettingsSchema = z.object({
  settings: z.object({
    sms: z.object({
      campaigns: z.boolean(),
    }),
    email: z.object({
      likes: z.boolean(),
      matches: z.boolean(),
      messages: z.boolean(),
      footprints: z.boolean(),
      others: z.boolean(),
    }),
  }),
});

// デフォルトの通知設定
const defaultSettings = {
  sms: {
    campaigns: false,
  },
  email: {
    likes: false,
    matches: false,
    messages: false,
    footprints: false,
    others: false,
  },
};

// 通知設定を取得
export async function GET() {
  try {
    // セッションからユーザー情報を取得
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        notificationSettings: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // 通知設定がない場合はデフォルト設定を返す
    if (!user.notificationSettings) {
      return NextResponse.json(
        { settings: defaultSettings },
        { status: 200 }
      );
    }

    // 通知設定が文字列として保存されている場合はパースする
    let settings;
    if (typeof user.notificationSettings === 'string') {
      try {
        settings = JSON.parse(user.notificationSettings);
      } catch (e) {
        settings = defaultSettings;
      }
    } else {
      settings = user.notificationSettings;
    }

    return NextResponse.json(
      { settings },
      { status: 200 }
    );
  } catch (error) {
    console.error('通知設定の取得に失敗しました:', error);
    return NextResponse.json(
      { error: '通知設定の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 通知設定を更新
export async function PUT(req: NextRequest) {
  try {
    // セッションの取得
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    // リクエストボディの取得
    const body = await req.json();
    const { settings } = body;
    
    // バリデーション
    try {
      // 基本的な構造チェックのみ行う
      if (!settings || typeof settings !== 'object') {
        return NextResponse.json(
          { error: '無効なデータ形式です: 設定オブジェクトが見つかりません' },
          { status: 400 }
        );
      }
      
      // 構造チェック: smsとemailが存在するか
      if (!settings.sms || !settings.email || typeof settings.sms !== 'object' || typeof settings.email !== 'object') {
        return NextResponse.json(
          { error: '無効なデータ形式です: smsまたはemailオブジェクトが正しくありません' },
          { status: 400 }
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: '無効なデータ形式です: ' + error.message },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: '入力に誤りがあります' },
        { status: 400 }
      );
    }
    
    // ユーザー情報を取得
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // 通知設定を更新
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        notificationSettings: settings,
      },
    });

    return NextResponse.json(
      { 
        message: '通知設定を更新しました', 
        settings,
        user: {
          email: updatedUser.email
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('通知設定の更新に失敗しました:', error);
    return NextResponse.json(
      { error: '通知設定の更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
