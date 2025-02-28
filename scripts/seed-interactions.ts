import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ランダムな日付を生成する関数（過去30日以内）
function randomDate() {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  return date;
}

// メイン関数
async function main() {
  console.log('ユーザー間の交流データを作成しています...');
  
  // すべてのユーザーを取得
  const users = await prisma.user.findMany({
    select: {
      id: true,
      gender: true
    }
  });
  
  const maleUsers = users.filter(user => user.gender === 'male');
  const femaleUsers = users.filter(user => user.gender === 'female');
  
  console.log(`男性ユーザー: ${maleUsers.length}人`);
  console.log(`女性ユーザー: ${femaleUsers.length}人`);
  
  // 既存のいいね数をチェック
  const existingLikes = await prisma.like.count();
  console.log(`既存のいいね数: ${existingLikes}`);
  
  // いいねを作成
  console.log('いいねデータを作成しています...');
  const createdLikes = [];
  
  // 各男性ユーザーから女性ユーザーへのいいね
  for (const maleUser of maleUsers) {
    // 50%の確率で各女性ユーザーにいいねを送る
    for (const femaleUser of femaleUsers) {
      if (Math.random() < 0.5) {
        try {
          const like = await prisma.like.create({
            data: {
              senderId: maleUser.id,
              receiverId: femaleUser.id,
              createdAt: randomDate()
            }
          });
          createdLikes.push(like);
        } catch (error) {
          // 既に存在する場合はスキップ
          console.log(`いいねは既に存在します: ${maleUser.id} -> ${femaleUser.id}`);
        }
      }
    }
  }
  
  // 各女性ユーザーから男性ユーザーへのいいね
  for (const femaleUser of femaleUsers) {
    // 30%の確率で各男性ユーザーにいいねを送る
    for (const maleUser of maleUsers) {
      if (Math.random() < 0.3) {
        try {
          const like = await prisma.like.create({
            data: {
              senderId: femaleUser.id,
              receiverId: maleUser.id,
              createdAt: randomDate()
            }
          });
          createdLikes.push(like);
        } catch (error) {
          // 既に存在する場合はスキップ
          console.log(`いいねは既に存在します: ${femaleUser.id} -> ${maleUser.id}`);
        }
      }
    }
  }
  
  console.log(`${createdLikes.length}件のいいねを作成しました`);
  
  // 足あとを作成
  console.log('足あとデータを作成しています...');
  const createdFootprints = [];
  
  // 各ユーザー間の足あと
  for (const user1 of users) {
    for (const user2 of users) {
      // 同じユーザーはスキップ
      if (user1.id === user2.id) continue;
      
      // 60%の確率で足あとを残す
      if (Math.random() < 0.6) {
        try {
          const footprint = await prisma.footprint.create({
            data: {
              leaverId: user1.id,
              receiverId: user2.id,
              createdAt: randomDate()
            }
          });
          createdFootprints.push(footprint);
        } catch (error) {
          // エラーがあればスキップ
          console.log(`足あとの作成に失敗: ${user1.id} -> ${user2.id}`);
        }
      }
    }
  }
  
  console.log(`${createdFootprints.length}件の足あとを作成しました`);
  
  // お気に入りを作成
  console.log('お気に入りデータを作成しています...');
  const createdFavorites = [];
  
  // 各ユーザーのお気に入り
  for (const user1 of users) {
    for (const user2 of users) {
      // 同じユーザーはスキップ
      if (user1.id === user2.id) continue;
      
      // 20%の確率でお気に入りに追加
      if (Math.random() < 0.2) {
        try {
          const favorite = await prisma.favorite.create({
            data: {
              ownerId: user1.id,
              favoriteId: user2.id,
              createdAt: randomDate()
            }
          });
          createdFavorites.push(favorite);
        } catch (error) {
          // エラーがあればスキップ
          console.log(`お気に入りの作成に失敗: ${user1.id} -> ${user2.id}`);
        }
      }
    }
  }
  
  console.log(`${createdFavorites.length}件のお気に入りを作成しました`);
  
  // メモを作成
  console.log('メモデータを作成しています...');
  const memos = [
    '素敵な人だった',
    'また会いたい',
    '趣味が合いそう',
    '連絡先を交換した',
    '仕事が忙しそうだった',
    '話しやすい人',
    '初回メッセージ待ち',
    'カフェで会う約束をした',
    '返信が遅い',
    'プロフィールが魅力的',
    '写真が素敵',
    '同じ出身地',
    '共通の趣味がある',
    '映画の話で盛り上がった',
    '料理が上手そう'
  ];
  
  const createdMemos = [];
  
  // お気に入りしたユーザーにメモを追加
  for (const favorite of createdFavorites) {
    // 70%の確率でメモを追加
    if (Math.random() < 0.7) {
      const randomMemo = memos[Math.floor(Math.random() * memos.length)];
      try {
        const memo = await prisma.memo.create({
          data: {
            userId: favorite.ownerId,
            aboutUserId: favorite.favoriteId,
            content: randomMemo,
            createdAt: randomDate(),
            updatedAt: randomDate()
          }
        });
        createdMemos.push(memo);
      } catch (error) {
        console.log(`メモの作成に失敗: ${favorite.ownerId} -> ${favorite.favoriteId}`);
      }
    }
  }
  
  console.log(`${createdMemos.length}件のメモを作成しました`);
  console.log('ユーザー間の交流データの作成が完了しました！');
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
