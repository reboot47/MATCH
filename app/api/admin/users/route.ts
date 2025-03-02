import { NextRequest, NextResponse } from 'next/server';

// モックユーザーデータ
// 実際の実装では、データベースからデータを取得します
const mockUsers = [
  {
    id: 'user_123',
    name: '田中響子',
    email: 'tanaka.kyoko@example.com',
    gender: 'female',
    age: 28,
    status: 'active',
    verified: true,
    createdAt: '2024-12-01T10:30:00',
    lastActive: '2025-03-01T14:25:00',
    profileImage: '/images/avatars/avatar-1.jpg',
    points: 2450,
    premium: true,
    reportCount: 0
  },
  {
    id: 'user_456',
    name: '佐藤健太',
    email: 'sato.kenta@example.com',
    gender: 'male',
    age: 32,
    status: 'active',
    verified: true,
    createdAt: '2024-12-05T08:45:00',
    lastActive: '2025-03-02T09:10:00',
    profileImage: '/images/avatars/avatar-2.jpg',
    points: 1200,
    premium: false,
    reportCount: 1
  },
  {
    id: 'user_789',
    name: '木村拓也',
    email: 'kimura.takuya@example.com',
    gender: 'male',
    age: 29,
    status: 'banned',
    verified: true,
    createdAt: '2024-12-10T15:20:00',
    lastActive: '2025-02-15T18:30:00',
    profileImage: '/images/avatars/avatar-3.jpg',
    points: 350,
    premium: false,
    reportCount: 5,
    banReason: '不適切なコンテンツの投稿'
  },
  {
    id: 'user_234',
    name: '山田優子',
    email: 'yamada.yuko@example.com',
    gender: 'female',
    age: 26,
    status: 'active',
    verified: true,
    createdAt: '2024-12-12T11:30:00',
    lastActive: '2025-03-02T20:15:00',
    profileImage: '/images/avatars/avatar-4.jpg',
    points: 3200,
    premium: true,
    reportCount: 0
  },
  {
    id: 'user_567',
    name: '高橋雄太',
    email: 'takahashi.yuta@example.com',
    gender: 'male',
    age: 35,
    status: 'suspended',
    verified: true,
    createdAt: '2024-12-15T09:40:00',
    lastActive: '2025-02-28T12:20:00',
    profileImage: '/images/avatars/avatar-5.jpg',
    points: 800,
    premium: false,
    reportCount: 2,
    suspensionEndDate: '2025-03-10T00:00:00',
    suspensionReason: 'プロフィール写真の偽装'
  },
  {
    id: 'user_890',
    name: '加藤さくら',
    email: 'kato.sakura@example.com',
    gender: 'female',
    age: 24,
    status: 'unverified',
    verified: false,
    createdAt: '2025-01-05T16:50:00',
    lastActive: '2025-03-01T19:25:00',
    profileImage: '/images/avatars/avatar-6.jpg',
    points: 100,
    premium: false,
    reportCount: 0
  },
  {
    id: 'user_901',
    name: '斎藤由美',
    email: 'saito.yumi@example.com',
    gender: 'female',
    age: 31,
    status: 'active',
    verified: true,
    createdAt: '2025-01-10T10:10:00',
    lastActive: '2025-03-02T17:40:00',
    profileImage: '/images/avatars/avatar-7.jpg',
    points: 1700,
    premium: true,
    reportCount: 0
  },
  {
    id: 'user_678',
    name: '伊藤大輔',
    email: 'ito.daisuke@example.com',
    gender: 'male',
    age: 27,
    status: 'dormant',
    verified: true,
    createdAt: '2025-01-15T14:20:00',
    lastActive: '2025-02-01T08:30:00',
    profileImage: '/images/avatars/avatar-8.jpg',
    points: 550,
    premium: false,
    reportCount: 0
  }
];

export async function GET(request: NextRequest) {
  // URLからクエリパラメータを取得
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  // ユーザーフィルタリング
  let filteredUsers = mockUsers;
  
  // 検索語句でフィルタリング
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // ステータスでフィルタリング
  if (status !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.status === status);
  }
  
  // ページネーション
  const paginatedUsers = filteredUsers.slice(offset, offset + limit);
  
  // レスポンス
  return NextResponse.json({
    users: paginatedUsers,
    total: filteredUsers.length,
    limit,
    offset
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // 実際の実装では、ここでデータベースに保存する処理を行います
    // モックの場合は成功レスポンスを返します
    
    return NextResponse.json({
      success: true,
      message: 'ユーザーが正常に作成されました',
      user: {
        id: `user_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    });
  } catch (error) {
    // エラーハンドリング
    return NextResponse.json(
      { success: false, error: 'ユーザー作成中にエラーが発生しました' },
      { status: 400 }
    );
  }
}
