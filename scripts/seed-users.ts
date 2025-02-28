import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker/locale/ja';

const prisma = new PrismaClient();

// ダミーユーザーのデータを作成する関数
async function createDummyUser(gender: 'male' | 'female', index: number) {
  const isMale = gender === 'male';
  
  // 性別に応じた名前を生成
  const firstName = isMale ? faker.person.firstName('male') : faker.person.firstName('female');
  const lastName = faker.person.lastName();
  const fullName = `${lastName} ${firstName}`;
  
  // ランダムな誕生日（20〜45歳）
  const minAge = 20;
  const maxAge = 45;
  const birthYear = new Date().getFullYear() - minAge - Math.floor(Math.random() * (maxAge - minAge));
  const birthMonth = Math.floor(Math.random() * 12);
  const birthDay = Math.floor(Math.random() * 28) + 1; // 簡略化のため28日まで
  const birthdate = new Date(birthYear, birthMonth, birthDay);
  
  // ランダムな身長（男性: 165-185cm, 女性: 150-170cm）
  const height = isMale
    ? Math.floor(Math.random() * 20) + 165
    : Math.floor(Math.random() * 20) + 150;
  
  // 電話番号（重複を避けるためインデックスを使用）
  const phoneNumber = `0901234${index.toString().padStart(4, '0')}`;
  
  // パスワードはすべて同じものを使用
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  // ランダムな職業
  const jobs = [
    'エンジニア', '医師', '弁護士', '教師', '公務員', 
    'デザイナー', 'マーケター', '会社員', '経営者', '学生',
    'フリーランス', '看護師', '薬剤師', '研究者', '販売員'
  ];
  const job = jobs[Math.floor(Math.random() * jobs.length)];
  
  // ランダムな学歴
  const educations = ['高校卒', '専門学校卒', '大学卒', '大学院卒'];
  const education = educations[Math.floor(Math.random() * educations.length)];
  
  // ランダムな収入
  const incomes = ['300万円未満', '300-500万円', '500-800万円', '800-1000万円', '1000万円以上'];
  const income = incomes[Math.floor(Math.random() * incomes.length)];
  
  // ランダムな目的
  const purposes = ['恋愛', '結婚', '友達作り', '趣味友達'];
  const purpose = purposes[Math.floor(Math.random() * purposes.length)];
  
  // ランダムなつぶやき
  const tweets = [
    '今日も頑張ります！', 'よろしくお願いします', 'マッチングアプリ初めてです',
    '素敵な出会いを探しています', '趣味は映画鑑賞です', '休日は料理をしています',
    '旅行が好きです', 'カフェ巡りが趣味です', '読書が好きです', 'ジムに通っています'
  ];
  const tweet = tweets[Math.floor(Math.random() * tweets.length)];
  
  // ランダムな自己紹介
  const introductions = [
    `初めまして、${fullName}です。${job}として働いています。休日は${isMale ? '映画鑑賞や旅行' : 'カフェ巡りや読書'}を楽しんでいます。よろしくお願いします。`,
    `${fullName}と申します。${purpose}を目的にしています。${isMale ? 'スポーツ観戦' : 'ショッピング'}が好きです。気軽にメッセージください！`,
    `${job}の${fullName}です。${isMale ? '料理と映画' : 'カフェ巡りと旅行'}が好きです。素敵な出会いがあればいいなと思っています。`,
    `${education}の${fullName}です。今は${job}として頑張っています。${isMale ? '音楽鑑賞とキャンプ' : 'ヨガとアート'}が趣味です。`,
    `${fullName}です。${isMale ? '車の運転とバイク' : 'お菓子作りとインテリア'}が好きです。同じ趣味の方とお話できると嬉しいです。`
  ];
  const selfIntroduction = introductions[Math.floor(Math.random() * introductions.length)];
  
  // ランダムな飲酒習慣
  const drinkings = ['飲まない', 'たまに飲む', '週1〜2回', '週3〜5回', 'ほぼ毎日'];
  const drinking = drinkings[Math.floor(Math.random() * drinkings.length)];
  
  // ランダムな喫煙習慣
  const smokings = ['吸わない', '時々吸う', '吸う', '電子タバコ', '禁煙中'];
  const smoking = smokings[Math.floor(Math.random() * smokings.length)];
  
  // ランダムな子供の予定
  const childrenPlans = ['欲しい', '欲しくない', 'どちらでも', '未定'];
  const childrenPlan = childrenPlans[Math.floor(Math.random() * childrenPlans.length)];
  
  // ランダムな結婚意思
  const marriageIntentions = ['結婚したい', '今は考えていない', 'お相手による', '再婚希望'];
  const marriageIntention = marriageIntentions[Math.floor(Math.random() * marriageIntentions.length)];
  
  // ランダムな言語
  const languageOptions = ['日本語', '英語', '中国語', '韓国語', 'フランス語', 'スペイン語'];
  const languages = [
    '日本語',
    ...Array.from({ length: Math.floor(Math.random() * 3) }, () => {
      return languageOptions[Math.floor(Math.random() * languageOptions.length)];
    })
  ].filter((item, index, self) => self.indexOf(item) === index); // 重複を削除
  
  // ランダムな興味
  const interestOptions = [
    '映画', '音楽', '料理', '旅行', 'スポーツ', '読書', 'アート', 'ファッション',
    'テクノロジー', 'アウトドア', 'ゲーム', 'カフェ巡り', '写真', 'ダンス', 'ヨガ',
    'DIY', 'ガーデニング', 'ペット', '車', 'バイク', '投資', '語学'
  ];
  const interests = Array.from(
    { length: 3 + Math.floor(Math.random() * 5) }, // 3〜7個の興味
    () => interestOptions[Math.floor(Math.random() * interestOptions.length)]
  ).filter((item, index, self) => self.indexOf(item) === index); // 重複を削除
  
  // ユーザーを作成
  return prisma.user.create({
    data: {
      phoneNumber,
      password: hashedPassword,
      name: fullName,
      gender,
      birthdate,
      height,
      job,
      education,
      income,
      purpose,
      tweet,
      selfIntroduction,
      drinking,
      smoking,
      childrenPlan,
      marriageIntention,
      languages,
      interests,
      planType: Math.random() > 0.8 ? 'gold' : 'standard', // 20%の確率でゴールド会員
    }
  });
}

// メイン関数
async function main() {
  console.log('ダミーユーザーの作成を開始します...');
  
  // 既存のユーザー数をチェック
  const userCount = await prisma.user.count();
  console.log(`現在のユーザー数: ${userCount}`);
  
  // 20人のダミーユーザーを作成 (10人の男性と10人の女性)
  const users = [];
  
  // 男性ユーザーを作成
  for (let i = 0; i < 10; i++) {
    users.push(await createDummyUser('male', i + 1));
    console.log(`男性ユーザー ${i + 1}/10 を作成しました`);
  }
  
  // 女性ユーザーを作成
  for (let i = 0; i < 10; i++) {
    users.push(await createDummyUser('female', i + 11));
    console.log(`女性ユーザー ${i + 1}/10 を作成しました`);
  }
  
  console.log(`${users.length}人のダミーユーザーを作成しました`);
  
  // 作成したユーザーのIDをログに出力
  console.log('作成されたユーザーID:');
  users.forEach(user => console.log(`- ${user.id}: ${user.name} (${user.gender})`));
}

// スクリプトを実行
main()
  .catch(e => {
    console.error('エラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    // データベース接続を閉じる
    await prisma.$disconnect();
  });
