import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }
    
    const userId = params.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        photos: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("ユーザー取得エラー:", error);
    return NextResponse.json(
      { error: "ユーザー情報の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }
    
    const userId = params.id;
    
    // セッションユーザーとリクエストされたユーザーIDが一致するか確認
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: "この操作を実行する権限がありません" },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        bio: body.bio,
        age: body.age,
        gender: body.gender,
        location: body.location,
        occupation: body.occupation,
        interests: body.interests,
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("ユーザー更新エラー:", error);
    return NextResponse.json(
      { error: "ユーザー情報の更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
