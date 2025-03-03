import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ルール検証スキーマ
const ruleSchema = z.object({
  name: z.string().min(1, "ルール名は必須です"),
  condition: z.object({
    type: z.string().min(1, "条件タイプは必須です"),
    value: z.string().min(1, "条件値は必須です"),
    operator: z.string().optional(),
  }),
  templateIds: z.array(z.string()).min(1, "少なくとも1つのテンプレートを選択してください"),
  delay: z.number().min(0, "遅延は0以上の値が必要です"),
  probability: z.number().min(1, "確率は1以上の値が必要です").max(100, "確率は100以下の値が必要です"),
  isActive: z.boolean().default(true),
  accountIds: z.array(z.string()).min(1, "少なくとも1つのアカウントを選択してください"),
});

// 管理者権限チェック
async function checkAdminAccess() {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

// 全ルール取得
export async function GET() {
  try {
    // 管理者権限チェック
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ルール取得
    const rules = await prisma.autoResponseRule.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        templates: true, // テンプレート情報も取得
      },
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error("ルール取得エラー:", error);
    return NextResponse.json(
      { error: "ルールの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// ルール作成
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
    const validatedData = ruleSchema.parse(body);

    // 指定されたテンプレートIDの存在確認
    const templateCount = await prisma.autoResponseTemplate.count({
      where: {
        id: {
          in: validatedData.templateIds,
        },
      },
    });

    if (templateCount !== validatedData.templateIds.length) {
      return NextResponse.json(
        { error: "指定されたテンプレートの一部が存在しません" },
        { status: 400 }
      );
    }

    // ルール作成
    const rule = await prisma.autoResponseRule.create({
      data: {
        name: validatedData.name,
        conditionType: validatedData.condition.type,
        conditionValue: validatedData.condition.value,
        conditionOperator: validatedData.condition.operator,
        delay: validatedData.delay,
        probability: validatedData.probability,
        isActive: validatedData.isActive,
        accountIds: validatedData.accountIds,
        templates: {
          connect: validatedData.templateIds.map(id => ({ id })),
        },
      },
      include: {
        templates: true,
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error("ルール作成エラー:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力データが不正です", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "ルールの作成に失敗しました" },
      { status: 500 }
    );
  }
}
