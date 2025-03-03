import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// テンプレート検証スキーマ
const templateSchema = z.object({
  name: z.string().min(1, "テンプレート名は必須です"),
  message: z.string().min(1, "メッセージは必須です"),
  category: z.string().min(1, "カテゴリは必須です"),
  isActive: z.boolean().default(true),
});

// 管理者権限チェック
async function checkAdminAccess() {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

// 全テンプレート取得
export async function GET() {
  try {
    // 管理者権限チェック
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // テンプレート取得
    const templates = await prisma.autoResponseTemplate.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("テンプレート取得エラー:", error);
    return NextResponse.json(
      { error: "テンプレートの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// テンプレート作成
export async function POST(request: Request) {
  try {
    // 管理者権限チェック
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // リクエストボディ取得
    const body = await request.json();
    
    // バリデーション
    const validatedData = templateSchema.parse(body);

    // テンプレート作成
    const template = await prisma.autoResponseTemplate.create({
      data: {
        name: validatedData.name,
        message: validatedData.message,
        category: validatedData.category,
        isActive: validatedData.isActive,
        useCount: 0,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("テンプレート作成エラー:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力データが不正です", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "テンプレートの作成に失敗しました" },
      { status: 500 }
    );
  }
}
