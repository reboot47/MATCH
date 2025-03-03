import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ルール更新検証スキーマ
const ruleUpdateSchema = z.object({
  name: z.string().min(1, "ルール名は必須です").optional(),
  condition: z
    .object({
      type: z.string().min(1, "条件タイプは必須です"),
      value: z.string().min(1, "条件値は必須です"),
      operator: z.string().optional(),
    })
    .optional(),
  templateIds: z
    .array(z.string())
    .min(1, "少なくとも1つのテンプレートを選択してください")
    .optional(),
  delay: z.number().min(0, "遅延は0以上の値が必要です").optional(),
  probability: z
    .number()
    .min(1, "確率は1以上の値が必要です")
    .max(100, "確率は100以下の値が必要です")
    .optional(),
  isActive: z.boolean().optional(),
  accountIds: z
    .array(z.string())
    .min(1, "少なくとも1つのアカウントを選択してください")
    .optional(),
});

// 管理者権限チェック
async function checkAdminAccess() {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

// ルール取得
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

    // ルール取得
    const rule = await prisma.autoResponseRule.findUnique({
      where: { id },
      include: {
        templates: true, // テンプレート情報も取得
      },
    });

    if (!rule) {
      return NextResponse.json(
        { error: "ルールが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(rule);
  } catch (error) {
    console.error("ルール取得エラー:", error);
    return NextResponse.json(
      { error: "ルールの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// ルール更新
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
    const validatedData = ruleUpdateSchema.parse(body);

    // ルール確認
    const existingRule = await prisma.autoResponseRule.findUnique({
      where: { id },
      include: {
        templates: true,
      },
    });

    if (!existingRule) {
      return NextResponse.json(
        { error: "ルールが見つかりません" },
        { status: 404 }
      );
    }

    // 更新データ準備
    const updateData: any = {};

    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.condition) {
      updateData.conditionType = validatedData.condition.type;
      updateData.conditionValue = validatedData.condition.value;
      updateData.conditionOperator = validatedData.condition.operator;
    }
    if (validatedData.delay !== undefined) updateData.delay = validatedData.delay;
    if (validatedData.probability !== undefined) updateData.probability = validatedData.probability;
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive;
    if (validatedData.accountIds) updateData.accountIds = validatedData.accountIds;

    // テンプレート関連の更新
    let templateOperation = {};
    if (validatedData.templateIds) {
      // 現在のテンプレート関連を解除
      templateOperation = {
        disconnect: existingRule.templates.map((template) => ({ id: template.id })),
        connect: validatedData.templateIds.map((id) => ({ id })),
      };
    }

    // ルール更新
    const updatedRule = await prisma.autoResponseRule.update({
      where: { id },
      data: {
        ...updateData,
        templates: templateOperation,
      },
      include: {
        templates: true,
      },
    });

    return NextResponse.json(updatedRule);
  } catch (error) {
    console.error("ルール更新エラー:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力データが不正です", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "ルールの更新に失敗しました" },
      { status: 500 }
    );
  }
}

// ルール削除
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

    // ルール確認
    const existingRule = await prisma.autoResponseRule.findUnique({
      where: { id },
    });

    if (!existingRule) {
      return NextResponse.json(
        { error: "ルールが見つかりません" },
        { status: 404 }
      );
    }

    // ルール削除
    await prisma.autoResponseRule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ルール削除エラー:", error);
    return NextResponse.json(
      { error: "ルールの削除に失敗しました" },
      { status: 500 }
    );
  }
}
