import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { v4 as uuidv4 } from 'uuid';
import { Policy, ContentType } from '@/types/policy';

// 開発用モックデータ
const mockPolicies: Policy[] = [
  {
    id: '1',
    name: 'プロフィール写真ガイドライン',
    description: 'プロフィール写真に関する基本的なガイドラインです。',
    contentType: 'photo',
    rules: [
      '本人確認可能な顔写真を含める必要があります',
      '複数人が映った写真は使用できません',
      '著作権侵害コンテンツは禁止です',
      '露出が過度な写真は禁止です'
    ],
    isActive: true,
    createdAt: new Date('2023-07-15').toISOString(),
    updatedAt: new Date('2023-09-20').toISOString()
  },
  {
    id: '2',
    name: 'メッセージ利用ポリシー',
    description: 'プラットフォーム内のメッセージ機能使用に関するガイドラインです。',
    contentType: 'message',
    rules: [
      '脅迫・嫌がらせは禁止です',
      '商業的勧誘は禁止です',
      '他のユーザーのプライバシーを尊重してください',
      '迷惑行為に対しては警告なしでアカウント停止となることがあります'
    ],
    isActive: true,
    createdAt: new Date('2023-08-05').toISOString(),
    updatedAt: new Date('2023-08-05').toISOString()
  },
  {
    id: '3',
    name: 'プロフィール情報ガイドライン',
    description: 'ユーザープロフィール情報に関する規定です。',
    contentType: 'profile',
    rules: [
      '実名を使用することを推奨します',
      '虚偽の情報提供は禁止です',
      '他人になりすますことは禁止です',
      '差別的表現・ヘイトスピーチは禁止です'
    ],
    isActive: true,
    createdAt: new Date('2023-06-20').toISOString(),
    updatedAt: new Date('2023-10-01').toISOString()
  },
  {
    id: '4',
    name: 'ライブ配信ガイドライン',
    description: 'ライブ配信機能を使用する際の規則です。',
    contentType: 'livestream',
    rules: [
      '暴力的コンテンツの配信は禁止です',
      '成人向けコンテンツは専用フラグを立てる必要があります',
      '第三者の権利を侵害するコンテンツは配信できません',
      '安全性に配慮した配信を心がけてください'
    ],
    isActive: false,
    createdAt: new Date('2023-09-10').toISOString(),
    updatedAt: new Date('2023-09-15').toISOString()
  }
];

// 管理者権限チェック
async function checkAdminAccess(request: NextRequest) {
  const session = await auth();
  
  if (!session || !session.user) {
    return { authorized: false, error: 'ログインしていません。' };
  }
  
  const userRole = session.user.role;
  
  if (userRole !== 'ADMIN' && userRole !== 'operator') {
    return { authorized: false, error: 'この操作を行う権限がありません。' };
  }
  
  return { authorized: true, error: null };
}

// GET: ポリシー一覧取得
export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const { authorized, error } = await checkAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }
    
    // クエリパラメータを取得
    const searchParams = request.nextUrl.searchParams;
    const contentTypeParam = searchParams.get('contentType');
    const searchQuery = searchParams.get('query')?.toLowerCase();
    
    // モックデータ（本番環境では実際のDBから取得）
    let filteredPolicies = [...mockPolicies];
    
    // コンテンツタイプによるフィルタリング
    if (contentTypeParam) {
      filteredPolicies = filteredPolicies.filter(
        policy => policy.contentType === contentTypeParam
      );
    }
    
    // 検索クエリによるフィルタリング
    if (searchQuery) {
      filteredPolicies = filteredPolicies.filter(
        policy => 
          policy.name.toLowerCase().includes(searchQuery) || 
          policy.description.toLowerCase().includes(searchQuery)
      );
    }
    
    // 最終更新日時でソート（新しい順）
    filteredPolicies.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    return NextResponse.json({ 
      policies: filteredPolicies,
      total: filteredPolicies.length
    });
    
  } catch (error) {
    console.error('ポリシー取得エラー:', error);
    return NextResponse.json(
      { error: 'ポリシーデータの取得中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}

// POST: 新規ポリシー作成
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const { authorized, error } = await checkAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }
    
    const data = await request.json();
    
    // バリデーション
    if (!data.name || !data.description || !data.contentType || !Array.isArray(data.rules) || data.rules.length === 0) {
      return NextResponse.json(
        { error: '必須項目が入力されていません。' },
        { status: 400 }
      );
    }
    
    // 新規ポリシーを作成
    const newPolicy: Policy = {
      id: uuidv4(), // ユニークID生成
      name: data.name,
      description: data.description,
      contentType: data.contentType as ContentType,
      rules: data.rules,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 本番環境ではここでDBに保存
    // 開発環境ではモックデータに追加
    mockPolicies.push(newPolicy);
    
    return NextResponse.json({ 
      policy: newPolicy,
      message: 'ポリシーが正常に作成されました。'
    }, { status: 201 });
    
  } catch (error) {
    console.error('ポリシー作成エラー:', error);
    return NextResponse.json(
      { error: 'ポリシーの作成中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}

// PUT: ポリシー更新
export async function PUT(request: NextRequest) {
  try {
    // 認証チェック
    const { authorized, error } = await checkAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }
    
    const data = await request.json();
    
    // バリデーション
    if (!data.id) {
      return NextResponse.json(
        { error: 'ポリシーIDが指定されていません。' },
        { status: 400 }
      );
    }
    
    // 既存ポリシーを検索
    const policyIndex = mockPolicies.findIndex(p => p.id === data.id);
    
    if (policyIndex === -1) {
      return NextResponse.json(
        { error: '指定されたポリシーが見つかりません。' },
        { status: 404 }
      );
    }
    
    // ポリシーを更新
    const updatedPolicy = {
      ...mockPolicies[policyIndex],
      name: data.name || mockPolicies[policyIndex].name,
      description: data.description || mockPolicies[policyIndex].description,
      contentType: data.contentType || mockPolicies[policyIndex].contentType,
      rules: data.rules || mockPolicies[policyIndex].rules,
      isActive: data.isActive !== undefined ? data.isActive : mockPolicies[policyIndex].isActive,
      updatedAt: new Date().toISOString()
    };
    
    // 本番環境ではここでDBを更新
    // 開発環境ではモックデータを更新
    mockPolicies[policyIndex] = updatedPolicy;
    
    return NextResponse.json({ 
      policy: updatedPolicy,
      message: 'ポリシーが正常に更新されました。'
    });
    
  } catch (error) {
    console.error('ポリシー更新エラー:', error);
    return NextResponse.json(
      { error: 'ポリシーの更新中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}

// DELETE: ポリシー削除
export async function DELETE(request: NextRequest) {
  try {
    // 認証チェック
    const { authorized, error } = await checkAdminAccess(request);
    if (!authorized) {
      return NextResponse.json({ error }, { status: 403 });
    }
    
    // URLからポリシーIDを取得
    const policyId = request.nextUrl.searchParams.get('id');
    
    if (!policyId) {
      return NextResponse.json(
        { error: 'ポリシーIDが指定されていません。' },
        { status: 400 }
      );
    }
    
    // 既存ポリシーを検索
    const policyIndex = mockPolicies.findIndex(p => p.id === policyId);
    
    if (policyIndex === -1) {
      return NextResponse.json(
        { error: '指定されたポリシーが見つかりません。' },
        { status: 404 }
      );
    }
    
    // 本番環境ではここでDBから削除
    // 開発環境ではモックデータから削除
    mockPolicies.splice(policyIndex, 1);
    
    return NextResponse.json({ 
      message: 'ポリシーが正常に削除されました。'
    });
    
  } catch (error) {
    console.error('ポリシー削除エラー:', error);
    return NextResponse.json(
      { error: 'ポリシーの削除中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}
