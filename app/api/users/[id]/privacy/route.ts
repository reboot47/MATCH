import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

// GETリクエスト - ユーザーのプライバシー設定を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // セッションを確認 - Next Auth v5の方法で取得
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const userId = params.id;
    
    // ユーザー自身のデータか権限があるか確認
    if (session.user.id !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'このアクションを実行する権限がありません' },
        { status: 403 }
      );
    }

    // ユーザーのプライバシー設定を取得
    // Note: 実際の実装ではデータベーススキーマに依存します
    const userPrivacy = await db.userPrivacy.findUnique({
      where: { userId },
    });

    if (!userPrivacy) {
      // ユーザーのプライバシー設定が存在しない場合はデフォルト設定を返す
      return NextResponse.json({
        privacySettings: [
          {
            id: 'profile_visibility',
            label: 'プロフィール表示',
            description: 'あなたのプロフィールを誰に表示するか設定します',
            value: 'matches',
            options: [
              { value: 'everyone', label: '全員', description: 'すべてのユーザーがあなたのプロフィールを見ることができます' },
              { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーだけがあなたのプロフィールを見ることができます' },
              { value: 'verified', label: '認証済みユーザーのみ', description: '認証済みユーザーだけがあなたのプロフィールを見ることができます' }
            ]
          },
          {
            id: 'messaging',
            label: 'メッセージ受信',
            description: '誰からメッセージを受け取るか設定します',
            value: 'matches',
            options: [
              { value: 'everyone', label: '全員', description: 'すべてのユーザーからメッセージを受け取ります' },
              { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーからのみメッセージを受け取ります' },
              { value: 'verified', label: '認証済みユーザーのみ', description: '認証済みユーザーからのみメッセージを受け取ります' }
            ]
          },
          {
            id: 'location_sharing',
            label: '位置情報の共有',
            description: 'あなたの位置情報をどのように共有するか設定します',
            value: 'city',
            options: [
              { value: 'precise', label: '正確な位置', description: '正確な現在地を共有します（より良いマッチングのために推奨）' },
              { value: 'city', label: '市区町村のみ', description: '市区町村レベルの大まかな位置情報のみを共有します' },
              { value: 'region', label: '都道府県のみ', description: '都道府県レベルの大まかな位置情報のみを共有します' },
              { value: 'none', label: '共有しない', description: '位置情報を共有しません（マッチングの質が低下する可能性があります）' }
            ]
          },
          {
            id: 'activity_visibility',
            label: 'アクティビティ表示',
            description: 'あなたのオンライン状態や最終ログイン時間を表示するか設定します',
            value: 'matches',
            options: [
              { value: 'everyone', label: '全員に表示', description: 'すべてのユーザーにあなたのアクティビティ状態を表示します' },
              { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーにのみアクティビティ状態を表示します' },
              { value: 'none', label: '表示しない', description: '誰にもアクティビティ状態を表示しません' }
            ]
          },
          {
            id: 'data_usage',
            label: 'データ利用設定',
            description: 'あなたのデータをサービス改善のために使用することを許可するか設定します',
            value: 'personalized',
            options: [
              { value: 'personalized', label: 'パーソナライズド', description: 'すべてのデータを使用してパーソナライズされた体験を提供します' },
              { value: 'limited', label: '限定的', description: '限定的なデータのみを使用します' },
              { value: 'minimal', label: '最小限', description: 'サービス提供に必要な最小限のデータのみを使用します' }
            ]
          }
        ]
      });
    }

    // データベースのモデルからフロントエンドで必要なフォーマットに変換
    const privacySettings = [
      {
        id: 'profile_visibility',
        label: 'プロフィール表示',
        description: 'あなたのプロフィールを誰に表示するか設定します',
        value: userPrivacy.profileVisibility,
        options: [
          { value: 'everyone', label: '全員', description: 'すべてのユーザーがあなたのプロフィールを見ることができます' },
          { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーだけがあなたのプロフィールを見ることができます' },
          { value: 'verified', label: '認証済みユーザーのみ', description: '認証済みユーザーだけがあなたのプロフィールを見ることができます' }
        ]
      },
      {
        id: 'messaging',
        label: 'メッセージ受信',
        description: '誰からメッセージを受け取るか設定します',
        value: userPrivacy.messagingPreference,
        options: [
          { value: 'everyone', label: '全員', description: 'すべてのユーザーからメッセージを受け取ります' },
          { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーからのみメッセージを受け取ります' },
          { value: 'verified', label: '認証済みユーザーのみ', description: '認証済みユーザーからのみメッセージを受け取ります' }
        ]
      },
      {
        id: 'location_sharing',
        label: '位置情報の共有',
        description: 'あなたの位置情報をどのように共有するか設定します',
        value: userPrivacy.locationSharing,
        options: [
          { value: 'precise', label: '正確な位置', description: '正確な現在地を共有します（より良いマッチングのために推奨）' },
          { value: 'city', label: '市区町村のみ', description: '市区町村レベルの大まかな位置情報のみを共有します' },
          { value: 'region', label: '都道府県のみ', description: '都道府県レベルの大まかな位置情報のみを共有します' },
          { value: 'none', label: '共有しない', description: '位置情報を共有しません（マッチングの質が低下する可能性があります）' }
        ]
      },
      {
        id: 'activity_visibility',
        label: 'アクティビティ表示',
        description: 'あなたのオンライン状態や最終ログイン時間を表示するか設定します',
        value: userPrivacy.activityVisibility,
        options: [
          { value: 'everyone', label: '全員に表示', description: 'すべてのユーザーにあなたのアクティビティ状態を表示します' },
          { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーにのみアクティビティ状態を表示します' },
          { value: 'none', label: '表示しない', description: '誰にもアクティビティ状態を表示しません' }
        ]
      },
      {
        id: 'data_usage',
        label: 'データ利用設定',
        description: 'あなたのデータをサービス改善のために使用することを許可するか設定します',
        value: userPrivacy.dataUsage,
        options: [
          { value: 'personalized', label: 'パーソナライズド', description: 'すべてのデータを使用してパーソナライズされた体験を提供します' },
          { value: 'limited', label: '限定的', description: '限定的なデータのみを使用します' },
          { value: 'minimal', label: '最小限', description: 'サービス提供に必要な最小限のデータのみを使用します' }
        ]
      }
    ];

    return NextResponse.json({ privacySettings });
  } catch (error) {
    console.error('Privacy settings fetch error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// PUTリクエスト - ユーザーのプライバシー設定を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // セッションを確認 - Next Auth v5の方法で取得
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const userId = params.id;
    
    // ユーザー自身のデータか権限があるか確認
    if (session.user.id !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'このアクションを実行する権限がありません' },
        { status: 403 }
      );
    }

    // リクエストボディからプライバシー設定を取得
    const { privacySettings } = await request.json();

    if (!privacySettings) {
      return NextResponse.json(
        { error: 'プライバシー設定が提供されていません' },
        { status: 400 }
      );
    }

    // 設定を検証
    const validSettings = validatePrivacySettings(privacySettings);
    if (!validSettings.valid) {
      return NextResponse.json(
        { error: validSettings.error },
        { status: 400 }
      );
    }

    // プライバシー設定を更新または作成
    // Note: 実際の実装ではデータベーススキーマに依存します
    const updatedPrivacy = await db.userPrivacy.upsert({
      where: { userId },
      update: {
        profileVisibility: privacySettings.find(p => p.id === 'profile_visibility')?.value || 'matches',
        messagingPreference: privacySettings.find(p => p.id === 'messaging')?.value || 'matches',
        locationSharing: privacySettings.find(p => p.id === 'location_sharing')?.value || 'city',
        activityVisibility: privacySettings.find(p => p.id === 'activity_visibility')?.value || 'matches',
        dataUsage: privacySettings.find(p => p.id === 'data_usage')?.value || 'personalized',
        updatedAt: new Date(),
      },
      create: {
        userId,
        profileVisibility: privacySettings.find(p => p.id === 'profile_visibility')?.value || 'matches',
        messagingPreference: privacySettings.find(p => p.id === 'messaging')?.value || 'matches',
        locationSharing: privacySettings.find(p => p.id === 'location_sharing')?.value || 'city',
        activityVisibility: privacySettings.find(p => p.id === 'activity_visibility')?.value || 'matches',
        dataUsage: privacySettings.find(p => p.id === 'data_usage')?.value || 'personalized',
      },
    });

    // フロントエンドに返す形式に変換
    const formattedSettings = [
      {
        id: 'profile_visibility',
        label: 'プロフィール表示',
        description: 'あなたのプロフィールを誰に表示するか設定します',
        value: updatedPrivacy.profileVisibility,
        options: [
          { value: 'everyone', label: '全員', description: 'すべてのユーザーがあなたのプロフィールを見ることができます' },
          { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーだけがあなたのプロフィールを見ることができます' },
          { value: 'verified', label: '認証済みユーザーのみ', description: '認証済みユーザーだけがあなたのプロフィールを見ることができます' }
        ]
      },
      {
        id: 'messaging',
        label: 'メッセージ受信',
        description: '誰からメッセージを受け取るか設定します',
        value: updatedPrivacy.messagingPreference,
        options: [
          { value: 'everyone', label: '全員', description: 'すべてのユーザーからメッセージを受け取ります' },
          { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーからのみメッセージを受け取ります' },
          { value: 'verified', label: '認証済みユーザーのみ', description: '認証済みユーザーからのみメッセージを受け取ります' }
        ]
      },
      {
        id: 'location_sharing',
        label: '位置情報の共有',
        description: 'あなたの位置情報をどのように共有するか設定します',
        value: updatedPrivacy.locationSharing,
        options: [
          { value: 'precise', label: '正確な位置', description: '正確な現在地を共有します（より良いマッチングのために推奨）' },
          { value: 'city', label: '市区町村のみ', description: '市区町村レベルの大まかな位置情報のみを共有します' },
          { value: 'region', label: '都道府県のみ', description: '都道府県レベルの大まかな位置情報のみを共有します' },
          { value: 'none', label: '共有しない', description: '位置情報を共有しません（マッチングの質が低下する可能性があります）' }
        ]
      },
      {
        id: 'activity_visibility',
        label: 'アクティビティ表示',
        description: 'あなたのオンライン状態や最終ログイン時間を表示するか設定します',
        value: updatedPrivacy.activityVisibility,
        options: [
          { value: 'everyone', label: '全員に表示', description: 'すべてのユーザーにあなたのアクティビティ状態を表示します' },
          { value: 'matches', label: 'マッチしたユーザーのみ', description: 'マッチしたユーザーにのみアクティビティ状態を表示します' },
          { value: 'none', label: '表示しない', description: '誰にもアクティビティ状態を表示しません' }
        ]
      },
      {
        id: 'data_usage',
        label: 'データ利用設定',
        description: 'あなたのデータをサービス改善のために使用することを許可するか設定します',
        value: updatedPrivacy.dataUsage,
        options: [
          { value: 'personalized', label: 'パーソナライズド', description: 'すべてのデータを使用してパーソナライズされた体験を提供します' },
          { value: 'limited', label: '限定的', description: '限定的なデータのみを使用します' },
          { value: 'minimal', label: '最小限', description: 'サービス提供に必要な最小限のデータのみを使用します' }
        ]
      }
    ];

    return NextResponse.json({ 
      message: 'プライバシー設定が更新されました',
      privacySettings: formattedSettings
    });
  } catch (error) {
    console.error('Privacy settings update error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// プライバシー設定のバリデーション
function validatePrivacySettings(settings: any[]) {
  // 必要なIDが全て含まれているか確認
  const requiredIds = [
    'profile_visibility',
    'messaging',
    'location_sharing',
    'activity_visibility',
    'data_usage'
  ];

  const providedIds = settings.map(s => s.id);
  const missingIds = requiredIds.filter(id => !providedIds.includes(id));

  if (missingIds.length > 0) {
    return { 
      valid: false,
      error: `次の必須設定が不足しています: ${missingIds.join(', ')}`
    };
  }

  // 各設定値の検証
  const validOptions = {
    profile_visibility: ['everyone', 'matches', 'verified'],
    messaging: ['everyone', 'matches', 'verified'],
    location_sharing: ['precise', 'city', 'region', 'none'],
    activity_visibility: ['everyone', 'matches', 'none'],
    data_usage: ['personalized', 'limited', 'minimal']
  };

  for (const setting of settings) {
    const validValues = validOptions[setting.id as keyof typeof validOptions];
    if (!validValues) {
      return { 
        valid: false,
        error: `不明な設定ID: ${setting.id}`
      };
    }

    if (!validValues.includes(setting.value)) {
      return { 
        valid: false,
        error: `${setting.id} の値 "${setting.value}" は無効です。有効な値: ${validValues.join(', ')}`
      };
    }
  }

  return { valid: true };
}
