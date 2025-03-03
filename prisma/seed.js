const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('テストデータの生成を開始します...');

    // 既存のユーザーを取得
    const users = await prisma.user.findMany({
      take: 5,
    });

    if (users.length < 2) {
      console.log('ユーザーデータがありません。先にユーザーを作成してください。');
      return;
    }

    // マッチを作成
    const match = await prisma.match.create({
      data: {
        users: {
          connect: [
            { id: users[0].id },
            { id: users[1].id }
          ]
        }
      }
    });

    console.log(`マッチを作成しました: ${match.id}`);

    // メッセージを作成（10件）
    const messageContents = [
      'こんにちは！はじめまして！',
      '趣味は何ですか？',
      '週末に時間ありますか？',
      'お勧めのレストランがあれば教えてください',
      '映画好きですか？',
      '今度の土曜日、一緒にカフェに行きませんか？',
      'プロフィール写真、素敵ですね！',
      '実は昨日あなたが言っていたお店に行ってみました',
      'ありがとう！とても楽しかったです',
      'また連絡します！'
    ];

    for (let i = 0; i < messageContents.length; i++) {
      const senderId = i % 2 === 0 ? users[0].id : users[1].id;
      const receiverId = i % 2 === 0 ? users[1].id : users[0].id;

      await prisma.message.create({
        data: {
          content: messageContents[i],
          matchId: match.id,
          senderId: senderId,
          receiverId: receiverId,
          read: i < 5, // 半分は既読にする
        }
      });
    }

    console.log(`${messageContents.length}件のメッセージを作成しました`);
    console.log('テストデータの生成が完了しました！');

  } catch (error) {
    console.error('テストデータの生成中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
