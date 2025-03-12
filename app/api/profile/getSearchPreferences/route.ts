import { NextResponse } from 'next/server';

// 本来はデータベースから取得するが、現段階ではモックデータで実装
export async function GET() {
  try {
    // ログインユーザーのプロフィールから検索条件の初期値を生成
    // 実際の実装ではAPIやデータベースからユーザーデータを取得する
    const userProfile = {
      nickname: "yuki",
      age: 31,
      gender: "female",
      location: "大阪府",
      detailArea: "梅田・北新地",
      height: 165,
      bodyType: "普通",
      occupation: "会社員",
      // 本人の属性情報
      drinkingHabit: "occasionally", // たまに飲む
      smokingHabit: "noSmoke", // 吸わない
      hobbies: ["読書", "映画鑑賞", "ヨガ"],
      // 相手に求める条件
      preferredAgeRange: [25, 40],
      preferredHeight: [160, 185],
      preferredBodyTypes: ["slim", "normal", "athletic"],
    };
    
    // 検索条件のデフォルト値を設定
    const searchPreferences = {
      // 年齢範囲（相手）
      ageRange: userProfile.preferredAgeRange || [18, 60],
      
      // 地域（本人の居住地を初期値に設定）
      areas: userProfile.detailArea 
        ? [userProfile.location, userProfile.detailArea]
        : [userProfile.location],
      
      // 身長範囲（相手）
      heightRange: userProfile.preferredHeight || [140, 200],
      
      // 体型（相手）
      bodyTypes: userProfile.preferredBodyTypes || [],
      
      // その他の検索条件も含める
      drinkingHabit: [],
      smokingHabit: [],
      purpose: [],
      meetingTime: [],
      
      // 自分のプロフィール情報（参照用）
      myProfile: {
        age: userProfile.age,
        gender: userProfile.gender,
        location: userProfile.location,
        detailArea: userProfile.detailArea,
      }
    };
    
    return NextResponse.json(searchPreferences);
  } catch (error) {
    console.error('検索条件取得エラー:', error);
    return NextResponse.json(
      { error: '検索条件の設定に失敗しました' },
      { status: 500 }
    );
  }
}
