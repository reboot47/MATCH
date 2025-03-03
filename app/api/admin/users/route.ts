import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuthMiddleware } from '@/middleware/adminAuth';

export async function GET(request: NextRequest) {
  // 管理者権限チェック
  const authResult = await adminAuthMiddleware(request);
  if (authResult) {
    return authResult;
  }

  try {
    // URLからクエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // クエリ条件を構築
    const where: any = {};
    
    // 検索語句でフィルタリング
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }
    
    // ステータスでフィルタリング（実際のデータモデルに合わせて変更する必要があります）
    if (status !== 'all') {
      // ステータスフィールドをデータモデルに追加する必要があります
      // where.status = status;
    }
    
    // 総件数を取得
    const total = await prisma.user.count({ where });
    
    // ユーザーデータを取得（ページネーション付き）
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        age: true,
        image: true,
        role: true,
        location: true,
        occupation: true,
        interests: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        // 実際のデータモデルに合わせて調整
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
    
    // レスポンス
    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // 管理者権限チェック
  const authResult = await adminAuthMiddleware(request);
  if (authResult) {
    return authResult;
  }
  
  try {
    const data = await request.json();
    
    // バリデーション
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        gender: data.gender || null,
        age: data.age || null,
        location: data.location || null,
        occupation: data.occupation || null,
        bio: data.bio || null,
        interests: data.interests || [],
        role: data.role || 'USER',
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'ユーザーが正常に作成されました',
      user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
