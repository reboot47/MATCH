import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 シードデータの作成を開始します...');

  // テスト用ユーザーの作成
  const users = await createUsers();
  
  // 管理者ユーザーの作成
  const adminUser = await prisma.user.create({
    data: {
      name: '管理者',
      email: 'admin@linebuzz.com',
      hashedPassword: await hash('password123', 10),
      bio: 'システム管理者です。',
      age: 35,
      gender: '非公開',
      location: '東京',
      occupation: 'システム管理者',
      interests: ['システム管理', 'セキュリティ', 'データ分析'],
      role: 'ADMIN'
    }
  });
  console.log(`  - 管理者ユーザー作成: ${adminUser.name}`);
  
  // マッチの作成
  const matches = await createMatches(users);
  
  // メッセージの作成
  await createMessages(users, matches);
  
  // 違反報告のテストデータを作成
  console.log('違反報告のテストデータを作成中...');
  
  const reportTypes = [
    'harassment', 
    'fake_profile', 
    'inappropriate_behavior', 
    'inappropriate_content', 
    'scam', 
    'underage', 
    'other'
  ];
  
  const reportStatuses = ['pending', 'investigating', 'resolved'];
  const severities = ['low', 'medium', 'high', 'critical'];
  
  // 各ユーザーが他のユーザーを報告
  for (let i = 0; i < users.length; i++) {
    // ランダムに2ユーザーを選んで報告
    for (let j = 0; j < 2; j++) {
      // 報告対象のユーザーを選択（自分以外）
      let reportedUserIndex;
      do {
        reportedUserIndex = Math.floor(Math.random() * users.length);
      } while (reportedUserIndex === i);
      
      const reportedUser = users[reportedUserIndex];
      const reportType = reportTypes[Math.floor(Math.random() * reportTypes.length)];
      const reportStatus = reportStatuses[Math.floor(Math.random() * reportStatuses.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      // 説明文のサンプル
      let description = '';
      switch (reportType) {
        case 'harassment':
          description = '何度も不適切なメッセージを送信してきました。ブロックしても別のアカウントから連絡してくるようです。';
          break;
        case 'fake_profile':
          description = 'プロフィール写真が明らかに別人です。芸能人の写真を使用していると思われます。';
          break;
        case 'inappropriate_behavior':
          description = '最初は普通でしたが、会話の中で不適切な誘いをしてきました。何度断っても執拗に続けてきます。';
          break;
        case 'inappropriate_content':
          description = '不適切な画像を送ってきました。こちらが不快感を示しても謝罪はありませんでした。';
          break;
        case 'scam':
          description = '投資話を持ちかけてきて外部サイトに誘導しようとしました。お金を要求してきています。';
          break;
        case 'underage':
          description = 'プロフィールでは23歳となっていますが、会話の中で高校生だと言っていました。';
          break;
        case 'other':
          description = '同じ人物が複数のアカウントを使い分けています。同じ写真を別アングルから撮影したものを使用しています。';
          break;
      }
      
      // 証拠画像のURLサンプル
      const evidenceUrls = [`evidence_${i}_${j}_1.jpg`, `evidence_${i}_${j}_2.jpg`];
      
      // 解決策（resolvedの場合のみ）
      let resolution = null;
      if (reportStatus === 'resolved') {
        const resolutions = ['warning', 'banned', 'dismissed', 'monitoring'];
        resolution = resolutions[Math.floor(Math.random() * resolutions.length)];
      }
      
      // 報告の作成
      await prisma.report.create({
        data: {
          reporterId: users[i].id,
          reportedId: reportedUser.id,
          type: reportType,
          description,
          status: reportStatus,
          severity,
          resolution,
          evidenceUrls,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
          updatedAt: new Date()
        }
      });
    }
  }
  
  console.log('✅ シードデータの作成が完了しました');
}

async function createUsers() {
  console.log('👤 ユーザーデータを作成中...');
  
  // 重複を避けるために既存のユーザーをクリア
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          'tanaka@example.com',
          'sato@example.com',
          'kimura@example.com',
          'yamada@example.com',
          'takahashi@example.com',
          'kato@example.com',
          'saito@example.com',
          'ito@example.com'
        ]
      }
    }
  });
  
  // 共通パスワード
  const password = await hash('password123', 10);
  
  // ユーザーデータの作成
  const userData = [
    {
      name: '田中響子',
      email: 'tanaka@example.com',
      hashedPassword: password,
      bio: '映画と読書が好きです。',
      age: 28,
      gender: '女性',
      location: '東京',
      occupation: 'デザイナー',
      interests: ['映画', '読書', 'アート']
    },
    {
      name: '佐藤健太',
      email: 'sato@example.com',
      hashedPassword: password,
      bio: '映画鑑賞とカフェ巡りが趣味です。',
      age: 32,
      gender: '男性',
      location: '東京',
      occupation: 'エンジニア',
      interests: ['映画', 'カフェ', '旅行']
    },
    {
      name: '木村拓也',
      email: 'kimura@example.com',
      hashedPassword: password,
      bio: 'スポーツ観戦が大好きです。',
      age: 26,
      gender: '男性',
      location: '大阪',
      occupation: '営業',
      interests: ['スポーツ', '音楽', 'ゲーム']
    },
    {
      name: '山田優子',
      email: 'yamada@example.com',
      hashedPassword: password,
      bio: '料理と旅行が趣味です。',
      age: 30,
      gender: '女性',
      location: '京都',
      occupation: '教師',
      interests: ['料理', '旅行', '写真']
    },
    {
      name: '高橋雄太',
      email: 'takahashi@example.com',
      hashedPassword: password,
      bio: '音楽とキャンプが好きです。',
      age: 29,
      gender: '男性',
      location: '福岡',
      occupation: '音楽家',
      interests: ['音楽', 'キャンプ', '登山']
    },
    {
      name: '加藤さくら',
      email: 'kato@example.com',
      hashedPassword: password,
      bio: 'ヨガとダンスが趣味です。',
      age: 27,
      gender: '女性',
      location: '名古屋',
      occupation: 'ヨガインストラクター',
      interests: ['ヨガ', 'ダンス', '健康']
    },
    {
      name: '斎藤由美',
      email: 'saito@example.com',
      hashedPassword: password,
      bio: 'アウトドアとクッキングが好きです。',
      age: 31,
      gender: '女性',
      location: '札幌',
      occupation: 'シェフ',
      interests: ['料理', 'アウトドア', 'ガーデニング']
    },
    {
      name: '伊藤大輔',
      email: 'ito@example.com',
      hashedPassword: password,
      bio: '写真撮影と旅行が趣味です。',
      age: 33,
      gender: '男性',
      location: '神戸',
      occupation: 'カメラマン',
      interests: ['写真', '旅行', 'ドライブ']
    }
  ];
  
  // 一括作成
  const users = [];
  
  for (const user of userData) {
    const createdUser = await prisma.user.create({
      data: user
    });
    users.push(createdUser);
    console.log(`  - ユーザー作成: ${createdUser.name}`);
  }
  
  return users;
}

async function createMatches(users: any[]) {
  console.log('💞 マッチデータを作成中...');
  
  // 既存のマッチをクリア
  await prisma.match.deleteMany({});
  
  // マッチの組み合わせを定義
  const matchPairs = [
    [0, 1], // 田中響子 & 佐藤健太
    [0, 7], // 田中響子 & 伊藤大輔
    [2, 3], // 木村拓也 & 山田優子
    [2, 6], // 木村拓也 & 斎藤由美
    [4, 5], // 高橋雄太 & 加藤さくら
    [3, 6]  // 山田優子 & 斎藤由美
  ];
  
  const matches = [];
  
  for (const [idx1, idx2] of matchPairs) {
    if (idx1 >= users.length || idx2 >= users.length) continue;
    
    const user1 = users[idx1];
    const user2 = users[idx2];
    
    const match = await prisma.match.create({
      data: {
        users: {
          connect: [
            { id: user1.id },
            { id: user2.id }
          ]
        }
      }
    });
    
    matches.push(match);
    console.log(`  - マッチ作成: ${user1.name} & ${user2.name}`);
  }
  
  return matches;
}

async function createMessages(users: any[], matches: any[]) {
  console.log('💬 メッセージデータを作成中...');
  
  // 既存のメッセージをクリア
  await prisma.message.deleteMany({});
  
  // メッセージデータの定義
  const messageData = [
    // マッチ1: 田中響子 & 佐藤健太
    {
      matchIdx: 0,
      senderIdx: 0,
      receiverIdx: 1,
      content: 'こんにちは、プロフィールを拝見しました。趣味が似ていて嬉しいです。',
      // 削除: isFlagged, isBlockedBySystem
    },
    {
      matchIdx: 0,
      senderIdx: 1,
      receiverIdx: 0,
      content: 'こんにちは！そうですね、映画鑑賞が趣味なんですね。最近見た映画はありますか？',
      // 削除: isFlagged, isBlockedBySystem
    },
    
    // マッチ3: 木村拓也 & 山田優子
    {
      matchIdx: 2,
      senderIdx: 2,
      receiverIdx: 3,
      content: 'こんばんは、よかったらLINEを交換しませんか？私のIDは...',
      // メタデータコメントとして保持（モデレーション情報）
      // モデレーション: 個人情報の交換試行でフラグ・ブロック
    },
    
    // マッチ4: 高橋雄太 & 加藤さくら
    {
      matchIdx: 3,
      senderIdx: 4,
      receiverIdx: 5,
      content: 'こんにちは！プロフィール写真がとても素敵ですね。もっとお話したいです。',
      // 削除: isFlagged, isBlockedBySystem
    },
    {
      matchIdx: 3,
      senderIdx: 5,
      receiverIdx: 4,
      content: 'ありがとうございます！趣味は何ですか？',
      // 削除: isFlagged, isBlockedBySystem
    },
    
    // マッチ5: 木村拓也 & 斎藤由美
    {
      matchIdx: 4,
      senderIdx: 2,
      receiverIdx: 6,
      content: 'おい、返事しろよ。何様のつもりだ。',
      // モデレーション: 攻撃的な言葉遣いでフラグ
    },
    {
      matchIdx: 4,
      senderIdx: 6,
      receiverIdx: 2,
      content: 'すみません、通知に気づかなかったです。そういった言葉遣いはやめていただけますか？',
      // 削除: isFlagged, isBlockedBySystem
    },
    
    // マッチ2: 田中響子 & 伊藤大輔
    {
      matchIdx: 1,
      senderIdx: 0,
      receiverIdx: 7,
      content: '先日はありがとうございました。とても楽しかったです。また会えたら嬉しいです。',
      // 削除: isFlagged, isBlockedBySystem
    },
    {
      matchIdx: 1,
      senderIdx: 7,
      receiverIdx: 0,
      content: 'こちらこそありがとう。また今度ぜひ。週末は空いてる？',
      // 削除: isFlagged, isBlockedBySystem
    },
    
    // マッチ6: 山田優子 & 斎藤由美
    {
      matchIdx: 5,
      senderIdx: 3,
      receiverIdx: 6,
      content: 'はじめまして！同じ趣味を持っている方を見つけて嬉しいです。',
      // 削除: isFlagged, isBlockedBySystem
    }
  ];
  
  for (const message of messageData) {
    const { matchIdx, senderIdx, receiverIdx, content } = message;
    
    if (matchIdx >= matches.length || senderIdx >= users.length || receiverIdx >= users.length) continue;
    
    const match = matches[matchIdx];
    const sender = users[senderIdx];
    const receiver = users[receiverIdx];
    
    await prisma.message.create({
      data: {
        content,
        match: { connect: { id: match.id } },
        sender: { connect: { id: sender.id } },
        receiver: { connect: { id: receiver.id } }
      }
    });
    
    console.log(`  - メッセージ作成: ${sender.name} → ${receiver.name}`);
  }
}

main()
  .catch((e) => {
    console.error('シードデータの作成中にエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
