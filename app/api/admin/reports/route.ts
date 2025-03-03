import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// 異常系に対するレスポンス関数
function errorResponse(status: number, message: string) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

// 管理者権限チェック関数
async function checkAdminAccess() {
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

/**
 * 報告一覧を取得
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/reports がリクエストされました');
    
    // 管理者権限チェック
    const authResult = await checkAdminAccess();
    if (!authResult.authorized) {
      return errorResponse(401, authResult.error);
    }

    // クエリパラメータを取得
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const severity = searchParams.get('severity') || '';
    const search = searchParams.get('search') || '';

    console.log('🔍 クエリパラメータ:', { page, limit, status, severity, search });

    // スキップ値を計算
    const skip = (page - 1) * limit;

    // 代替データの作成（開発用）
    console.log('⚠️ 開発用モックデータを使用します');
    
    // 模擬ユーザー
    const mockUsers = [
      { id: '1', name: 'Admin User', email: 'admin@linebuzz.jp', image: '/images/avatar-1.jpg' },
      { id: '2', name: 'Test User', email: 'test@linebuzz.jp', image: '/images/avatar-2.jpg' },
      { id: '3', name: '運営管理者', email: 'operator@linebuzz.jp', image: '/images/avatar-3.jpg' },
      { id: '4', name: 'Reported User', email: 'reported@example.com', image: '/images/avatar-4.jpg' }
    ];
    
    // 模擬報告データ
    const reportTypes = ['inappropriate_content', 'spam', 'harassment', 'fake_account', 'other'];
    const reportStatuses = ['pending', 'investigating', 'resolved', 'rejected'];
    const reportSeverities = ['low', 'medium', 'high', 'critical'];
    
    const mockReports = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      type: reportTypes[i % reportTypes.length],
      description: `報告内容 ${i+1}: ${
        i % 2 === 0 ? '不適切なメッセージが送信されました' : 
        i % 3 === 0 ? 'スパムメッセージが大量に送られてきました' : 
        'ユーザーが嫌がらせを行っています'
      }`,
      status: reportStatuses[i % reportStatuses.length],
      severity: reportSeverities[i % reportSeverities.length],
      resolution: i % 4 === 0 ? 'ユーザーに警告を送信しました' : null,
      evidenceUrls: [
        i % 3 === 0 ? '/images/evidence1.jpg' : null, 
        i % 5 === 0 ? '/images/evidence2.jpg' : null
      ].filter(Boolean) as string[],
      notes: i % 3 === 0 ? '管理者メモ: 継続監視が必要です' : null,
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(Date.now() - i * 43200000),
      reporterId: mockUsers[i % 2].id,
      reportedId: mockUsers[(i % 2) + 2].id,
      Reporter: mockUsers[i % 2],
      Reported: mockUsers[(i % 2) + 2],
      adminMemo: i % 3 === 0 ? '継続監視が必要です' : null
    }));
    
    // フィルタリング処理
    let filteredReports = [...mockReports];
    
    if (search) {
      filteredReports = filteredReports.filter(report => 
        report.description.toLowerCase().includes(search.toLowerCase()) ||
        report.Reporter.name.toLowerCase().includes(search.toLowerCase()) ||
        report.Reported.name.toLowerCase().includes(search.toLowerCase()) ||
        (report.adminMemo && report.adminMemo.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (status) {
      filteredReports = filteredReports.filter(report => report.status === status);
    }
    
    if (severity) {
      filteredReports = filteredReports.filter(report => report.severity === severity);
    }
    
    // ページネーション
    const total = filteredReports.length;
    const pages = Math.ceil(total / limit);
    
    // ソート（デフォルトは作成日の降順）
    filteredReports.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // ページに該当するデータを取得
    const pagedReports = filteredReports.slice(skip, skip + limit);
    
    console.log(`📊 モック報告: 全${total}件中 ${pagedReports.length}件を返します`);
    
    return NextResponse.json({
      data: pagedReports,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    });
  } catch (error) {
    console.error('報告取得エラー:', error);
    return NextResponse.json(
      { error: '報告の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * 報告のステータスや深刻度を更新
 */
export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 PUT /api/admin/reports がリクエストされました');
    
    // 管理者権限チェック
    const authResult = await checkAdminAccess();
    if (!authResult.authorized) {
      return errorResponse(401, authResult.error);
    }

    // リクエストボディの解析
    const body = await request.json();
    const { id, status, severity, resolution, adminMemo } = body;
    
    // 入力検証
    if (!id) {
      return errorResponse(400, 'Report ID is required');
    }
    
    // 代替データの作成（開発用）
    console.log('⚠️ 開発用モックデータを使用します');
    
    // 模擬ユーザー
    const mockUsers = [
      { id: '1', name: 'Admin User', email: 'admin@linebuzz.jp', image: '/images/avatar-1.jpg' },
      { id: '2', name: 'Test User', email: 'test@linebuzz.jp', image: '/images/avatar-2.jpg' },
      { id: '3', name: '運営管理者', email: 'operator@linebuzz.jp', image: '/images/avatar-3.jpg' },
      { id: '4', name: 'Reported User', email: 'reported@example.com', image: '/images/avatar-4.jpg' }
    ];
    
    // 模擬報告データ
    const reportTypes = ['inappropriate_content', 'spam', 'harassment', 'fake_account', 'other'];
    const reportStatuses = ['pending', 'investigating', 'resolved', 'rejected'];
    const reportSeverities = ['low', 'medium', 'high', 'critical'];
    
    const mockReports = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      type: reportTypes[i % reportTypes.length],
      description: `報告内容 ${i+1}: ${
        i % 2 === 0 ? '不適切なメッセージが送信されました' : 
        i % 3 === 0 ? 'スパムメッセージが大量に送られてきました' : 
        'ユーザーが嫌がらせを行っています'
      }`,
      status: reportStatuses[i % reportStatuses.length],
      severity: reportSeverities[i % reportSeverities.length],
      resolution: i % 4 === 0 ? 'ユーザーに警告を送信しました' : null,
      evidenceUrls: [
        i % 3 === 0 ? '/images/evidence1.jpg' : null, 
        i % 5 === 0 ? '/images/evidence2.jpg' : null
      ].filter(Boolean) as string[],
      notes: i % 3 === 0 ? '管理者メモ: 継続監視が必要です' : null,
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(Date.now() - i * 43200000),
      reporterId: mockUsers[i % 2].id,
      reportedId: mockUsers[(i % 2) + 2].id,
      Reporter: mockUsers[i % 2],
      Reported: mockUsers[(i % 2) + 2],
      adminMemo: i % 3 === 0 ? '継続監視が必要です' : null
    }));
    
    // 更新データの作成
    const updatedReport = mockReports.find(report => report.id === parseInt(id));
    
    if (!updatedReport) {
      return errorResponse(404, 'Report not found');
    }
    
    updatedReport.status = status;
    updatedReport.severity = severity;
    updatedReport.resolution = resolution;
    updatedReport.adminMemo = adminMemo;
    
    console.log(`📝 報告 ${id} を更新しました`);
    
    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('報告更新エラー:', error);
    return NextResponse.json(
      { error: '報告の更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * 報告を削除
 */
export async function DELETE(request: NextRequest) {
  try {
    console.log('🔍 DELETE /api/admin/reports がリクエストされました');
    
    // 管理者権限チェック
    const authResult = await checkAdminAccess();
    if (!authResult.authorized) {
      return errorResponse(401, authResult.error);
    }

    // リクエストボディの解析
    const body = await request.json();
    const { id } = body;
    
    // 入力検証
    if (!id) {
      return errorResponse(400, 'Report ID is required');
    }
    
    // 代替データの作成（開発用）
    console.log('⚠️ 開発用モックデータを使用します');
    
    // 模擬ユーザー
    const mockUsers = [
      { id: '1', name: 'Admin User', email: 'admin@linebuzz.jp', image: '/images/avatar-1.jpg' },
      { id: '2', name: 'Test User', email: 'test@linebuzz.jp', image: '/images/avatar-2.jpg' },
      { id: '3', name: '運営管理者', email: 'operator@linebuzz.jp', image: '/images/avatar-3.jpg' },
      { id: '4', name: 'Reported User', email: 'reported@example.com', image: '/images/avatar-4.jpg' }
    ];
    
    // 模擬報告データ
    const reportTypes = ['inappropriate_content', 'spam', 'harassment', 'fake_account', 'other'];
    const reportStatuses = ['pending', 'investigating', 'resolved', 'rejected'];
    const reportSeverities = ['low', 'medium', 'high', 'critical'];
    
    const mockReports = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      type: reportTypes[i % reportTypes.length],
      description: `報告内容 ${i+1}: ${
        i % 2 === 0 ? '不適切なメッセージが送信されました' : 
        i % 3 === 0 ? 'スパムメッセージが大量に送られてきました' : 
        'ユーザーが嫌がらせを行っています'
      }`,
      status: reportStatuses[i % reportStatuses.length],
      severity: reportSeverities[i % reportSeverities.length],
      resolution: i % 4 === 0 ? 'ユーザーに警告を送信しました' : null,
      evidenceUrls: [
        i % 3 === 0 ? '/images/evidence1.jpg' : null, 
        i % 5 === 0 ? '/images/evidence2.jpg' : null
      ].filter(Boolean) as string[],
      notes: i % 3 === 0 ? '管理者メモ: 継続監視が必要です' : null,
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(Date.now() - i * 43200000),
      reporterId: mockUsers[i % 2].id,
      reportedId: mockUsers[(i % 2) + 2].id,
      Reporter: mockUsers[i % 2],
      Reported: mockUsers[(i % 2) + 2],
      adminMemo: i % 3 === 0 ? '継続監視が必要です' : null
    }));
    
    // 削除データの作成
    const deletedReport = mockReports.find(report => report.id === parseInt(id));
    
    if (!deletedReport) {
      return errorResponse(404, 'Report not found');
    }
    
    console.log(`📝 報告 ${id} を削除しました`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('報告削除エラー:', error);
    return NextResponse.json(
      { error: '報告の削除中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
