import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// テンプレート検証スキーマ
const templateUpdateSchema = z.object({
  name: z.string().min(1, "テンプレート名は必須です").optional(),
  message: z.string().min(1, "メッセージは必須です").optional(),
  category: z.string().min(1, "カテゴリは必須です").optional(),
  isActive: z.boolean().optional(),
});

// 管理者権限チェック
async function checkAdminAccess() {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

// テンプレート取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限チェック
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // テンプレート取得
    const template = await prisma.autoResponseTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "テンプレートが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("テンプレート取得エラー:", error);
    return NextResponse.json(
      { error: "テンプレートの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// テンプレート更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限チェック
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // バリデーション
    const validatedData = templateUpdateSchema.parse(body);

    // テンプレート確認
    const existingTemplate = await prisma.autoResponseTemplate.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "テンプレートが見つかりません" },
        { status: 404 }
      );
    }

    // テンプレート更新
    const updatedTemplate = await prisma.autoResponseTemplate.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error("テンプレート更新エラー:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力データが不正です", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "テンプレートの更新に失敗しました" },
      { status: 500 }
    );
  }
}

// テンプレート削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限チェック
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // テンプレート確認
    const existingTemplate = await prisma.autoResponseTemplate.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "テンプレートが見つかりません" },
        { status: 404 }
      );
    }

    // テンプレート削除
    await prisma.autoResponseTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("テンプレート削除エラー:", error);
    return NextResponse.json(
      { error: "テンプレートの削除に失敗しました" },
      { status: 500 }
    );
  }
}
