import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationCode } from '@/lib';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// 認証コードを送信するAPIエンドポイント
export async function POST(request: NextRequest) {
  try {
    // 認証済みユーザーのみアクセス可能
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    // リクエストの内容を取得
    const data = await request.json();
    const { phoneNumber } = data;

    // 電話番号が提供されていない場合はエラー
    if (!phoneNumber) {
      return NextResponse.json({ error: '電話番号は必須です' }, { status: 400 });
    }

    // 認証コードを生成して送信
    const verification = await sendVerificationCode(phoneNumber);

    if (!verification.success) {
      return NextResponse.json(
        { error: '認証コードの送信に失敗しました', details: verification.error },
        { status: 500 }
      );
    }

    // 認証コードと有効期限をデータベースに保存
    // 有効期限は10分（600秒）に設定
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    // すでに存在する認証情報を更新するか、新規作成
    await prisma.verificationToken.upsert({
      where: {
        identifier: phoneNumber,
      },
      update: {
        token: verification.verificationCode as string,
        expires: expiresAt,
      },
      create: {
        identifier: phoneNumber,
        token: verification.verificationCode as string,
        expires: expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: '認証コードが送信されました',
    });
  } catch (error) {
    console.error('電話番号認証エラー:', error);
    return NextResponse.json(
      { error: '認証コードの処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 認証コードを確認するAPIエンドポイント
export async function PUT(request: NextRequest) {
  try {
    // 認証済みユーザーのみアクセス可能
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    // リクエストの内容を取得
    const data = await request.json();
    const { phoneNumber, code } = data;

    // 必須パラメータのチェック
    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: '電話番号と認証コードは必須です' },
        { status: 400 }
      );
    }

    // データベースから認証情報を取得
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier: phoneNumber,
      },
    });

    // 認証情報が存在しない場合
    if (!verificationToken) {
      return NextResponse.json(
        { error: '認証情報が見つかりません。再度認証コードを要求してください' },
        { status: 404 }
      );
    }

    // 認証コードが期限切れの場合
    if (verificationToken.expires < new Date()) {
      // 期限切れのトークンを削除
      await prisma.verificationToken.delete({
        where: { identifier: phoneNumber },
      });
      
      return NextResponse.json(
        { error: '認証コードの有効期限が切れています。再度認証コードを要求してください' },
        { status: 410 }
      );
    }

    // 認証コードが一致しない場合
    if (verificationToken.token !== code) {
      return NextResponse.json(
        { error: '認証コードが正しくありません' },
        { status: 400 }
      );
    }

    // 認証が成功した場合、ユーザー情報を更新
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        phoneNumber,
        phoneVerified: true,
      },
    });

    // 使用済みの認証情報を削除
    await prisma.verificationToken.delete({
      where: { identifier: phoneNumber },
    });

    return NextResponse.json({
      success: true,
      message: '電話番号が認証されました',
    });
  } catch (error) {
    console.error('電話番号認証確認エラー:', error);
    return NextResponse.json(
      { error: '認証コードの確認中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
