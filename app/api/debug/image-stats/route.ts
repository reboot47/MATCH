// 画像表示コンポーネントのデバッグ情報APIエンドポイント
import { NextRequest, NextResponse } from 'next/server';
import { getImageStats, resetImageStats } from '@/app/utils/imageDebugger';

/**
 * 画像表示デバッグ情報のAPIエンドポイント
 * 
 * このAPIは開発環境でのみ使用可能で、画像読み込みの成功/エラー統計を返します。
 * このデータは、画像表示問題のトラブルシューティングに役立ちます。
 * 
 * GET: 現在の統計情報を取得
 * POST: 統計情報をリセット
 */
export async function GET(_request: NextRequest) {
  // 本番環境ではアクセスを拒否
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(JSON.stringify({ error: '本番環境では利用できません' }), { 
      status: 403,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
  
  // 画像統計情報を取得
  const stats = getImageStats();
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    stats
  });
}

/**
 * 統計情報のリセット
 */
export async function POST(_request: NextRequest) {
  // 本番環境ではアクセスを拒否
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(JSON.stringify({ error: '本番環境では利用できません' }), { 
      status: 403,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
  
  // 統計をリセット
  resetImageStats();
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    message: '画像統計情報がリセットされました',
    stats: getImageStats() // リセット後の空の統計情報を返す
  });
}
