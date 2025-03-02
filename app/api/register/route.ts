import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // メールアドレスがすでに使用されているか確認
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'このメールアドレスは既に使用されています' },
        { status: 409 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      },
    });

    return NextResponse.json(
      { message: 'ユーザーが正常に登録されました', user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    return NextResponse.json(
      { message: '登録中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
