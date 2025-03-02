import { NextRequest, NextResponse } from 'next/server';

// 前回実装したモック報告データを再利用
const mockReports = [
  {
    id: 1,
    reporterId: 'user_123',
    reporterName: '田中響子',
    reportedId: 'user_456',
    reportedName: '佐藤健太',
    type: 'inappropriate_behavior',
    description: 'メッセージで不適切な誘いをしてきました。何度断っても執拗に誘ってきます。',
    status: 'pending',
    createdAt: '2025-03-02T15:30:00',
    updatedAt: '2025-03-02T15:30:00',
    severity: 'medium',
    evidenceUrls: ['message_12345.jpg']
  },
  {
    id: 2,
    reporterId: 'user_234',
    reporterName: '山田優子',
    reportedId: 'user_567',
    reportedName: '高橋雄太',
    type: 'fake_profile',
    description: 'プロフィール写真が明らかに別人のものです。芸能人の写真を使用しています。',
    status: 'investigating',
    createdAt: '2025-03-02T14:20:00',
    updatedAt: '2025-03-02T16:15:00',
    severity: 'medium',
    evidenceUrls: ['profile_evidence_234.jpg', 'chat_evidence_234.jpg']
  },
  {
    id: 3,
    reporterId: 'user_345',
    reporterName: '鈴木美咲',
    reportedId: 'user_678',
    reportedName: '伊藤大輔',
    type: 'harassment',
    description: '拒否した後も何度もメッセージを送り続けてきます。ストーカー行為のように感じます。',
    status: 'resolved',
    createdAt: '2025-03-01T10:45:00',
    updatedAt: '2025-03-02T13:20:00',
    resolution: 'warning',
    severity: 'high',
    evidenceUrls: ['chat_log_345.jpg', 'message_screenshot_345.jpg']
  },
  {
    id: 4,
    reporterId: 'user_456',
    reporterName: '中村美香',
    reportedId: 'user_789',
    reportedName: '木村拓也',
    type: 'inappropriate_content',
    description: '不適切な画像を送ってきました。',
    status: 'resolved',
    createdAt: '2025-03-01T09:30:00',
    updatedAt: '2025-03-02T11:40:00',
    resolution: 'banned',
    severity: 'critical',
    evidenceUrls: ['evidence_456.jpg']
  },
  {
    id: 5,
    reporterId: 'user_567',
    reporterName: '小林健太',
    reportedId: 'user_890',
    reportedName: '加藤さくら',
    type: 'scam',
    description: 'お金を要求してきました。外部サイトに誘導しようとしています。',
    status: 'investigating',
    createdAt: '2025-03-01T08:15:00',
    updatedAt: '2025-03-02T10:30:00',
    severity: 'high',
    evidenceUrls: ['chat_evidence_567.jpg', 'link_evidence_567.jpg']
  },
  {
    id: 6,
    reporterId: 'user_678',
    reporterName: '渡辺隆',
    reportedId: 'user_901',
    reportedName: '斎藤由美',
    type: 'underage',
    description: 'プロフィールには25歳となっていますが、会話の中で高校生だと言っていました。',
    status: 'pending',
    createdAt: '2025-03-01T16:40:00',
    updatedAt: '2025-03-01T16:40:00',
    severity: 'high',
    evidenceUrls: ['chat_screenshot_678.jpg']
  },
  {
    id: 7,
    reporterId: 'user_789',
    reporterName: '松本拓也',
    reportedId: 'user_012',
    reportedName: '井上智子',
    type: 'other',
    description: '複数のアカウントを使い分けているようです。同じ人物が別のアカウントから連絡してきました。',
    status: 'pending',
    createdAt: '2025-03-01T15:20:00',
    updatedAt: '2025-03-01T15:20:00',
    severity: 'low',
    evidenceUrls: ['profile_comparison_789.jpg']
  }
];

export async function GET(request: NextRequest) {
  // URLからクエリパラメータを取得
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const type = searchParams.get('type') || 'all';
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  // 報告フィルタリング
  let filteredReports = mockReports;
  
  // 検索語句でフィルタリング
  if (searchTerm) {
    filteredReports = filteredReports.filter(report => 
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // ステータスでフィルタリング
  if (status !== 'all') {
    filteredReports = filteredReports.filter(report => report.status === status);
  }
  
  // タイプでフィルタリング
  if (type !== 'all') {
    filteredReports = filteredReports.filter(report => report.type === type);
  }
  
  // ページネーション
  const paginatedReports = filteredReports.slice(offset, offset + limit);
  
  // レスポンス
  return NextResponse.json({
    reports: paginatedReports,
    total: filteredReports.length,
    limit,
    offset
  });
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, action, resolution, notes } = data;
    
    // 実際の実装では、ここでデータベースの更新処理を行います
    // モックの場合は成功レスポンスを返します
    
    let report = mockReports.find(r => r.id === id);
    if (!report) {
      return NextResponse.json(
        { success: false, error: '報告が見つかりません' },
        { status: 404 }
      );
    }
    
    let updatedReport = { ...report };
    const now = new Date().toISOString();
    
    // アクションによる更新
    switch (action) {
      case 'investigate':
        updatedReport.status = 'investigating';
        updatedReport.updatedAt = now;
        if (notes) updatedReport.notes = notes;
        break;
      case 'resolve':
        updatedReport.status = 'resolved';
        updatedReport.updatedAt = now;
        updatedReport.resolution = resolution || 'dismissed';
        if (notes) updatedReport.notes = notes;
        break;
      case 'reopen':
        updatedReport.status = 'pending';
        updatedReport.updatedAt = now;
        if (notes) updatedReport.notes = notes;
        break;
      default:
        return NextResponse.json(
          { success: false, error: '無効なアクションです' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      message: `報告が正常に${
        action === 'investigate' ? '調査中に変更' : 
        action === 'resolve' ? '解決済みに変更' : 
        '再開'
      }されました`,
      updatedReport
    });
  } catch (error) {
    // エラーハンドリング
    return NextResponse.json(
      { success: false, error: '報告更新中にエラーが発生しました' },
      { status: 400 }
    );
  }
}
