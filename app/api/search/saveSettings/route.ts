import { NextResponse } from 'next/server';
import { getUserId } from '../../../utils/auth';

export async function POST(request: Request) {
  try {
    const userId = getUserId();
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'ユーザー認証に失敗しました。再度ログインしてください。' 
        }, 
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // ここでデータベースに保存する処理を実装
    // 現在はモックデータとして扱います
    // TODO: 実際のデータベースへの保存に置き換える
    console.log(`User ${userId} search settings saved:`, data);
    
    // 成功レスポンス
    return NextResponse.json({ 
      success: true, 
      message: '検索設定を保存しました' 
    });
    
  } catch (error) {
    console.error('検索設定の保存に失敗しました:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '検索設定の保存に失敗しました。しばらく経ってから再度お試しください。' 
      }, 
      { status: 500 }
    );
  }
}
