import { NextResponse } from 'next/server';
import { getUserId } from '../../../utils/auth';

export async function GET() {
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

    // ここでデータベースから検索設定を取得する処理を実装
    // 現在はモックデータとして扱います
    // TODO: 実際のデータベースからの取得に置き換える
    
    // デフォルトの検索設定（プロフィールの項目と完全に一致）
    const defaultSettings = {
      // 基本的な検索条件
      freeWord: '',
      ageRange: [18, 60],
      purpose: [],
      meetingTime: [],
      drinkingHabit: [],
      smokingHabit: [],
      heightRange: [140, 200],
      areas: [],
      
      // 相手に求める条件
      bodyTypes: [],
      occupation: [],
      annualIncome: '',
      educationalBackground: '',
      
      // 他のフィルター条件
      hasPhoto: false,
      isVerified: false,
      hobbies: [],
      
      // プロフィール情報（参照用）
      myProfile: {
        age: 0,
        gender: '',
        location: '',
        detailArea: '',
      }
    };
    
    // 成功レスポンス
    return NextResponse.json({ 
      success: true, 
      data: defaultSettings
    });
    
  } catch (error) {
    console.error('検索設定の取得に失敗しました:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '検索設定の取得に失敗しました。しばらく経ってから再度お試しください。' 
      }, 
      { status: 500 }
    );
  }
}
