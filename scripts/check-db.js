// check-db.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // データベース接続確認
    console.log('データベース接続を確認しています...');
    await prisma.$connect();
    console.log('データベースに正常に接続しました。');

    // ユーザー数を取得
    const userCount = await prisma.user.count();
    console.log(`ユーザー数: ${userCount}`);

    // マッチ数を取得
    const matchCount = await prisma.match.count();
    console.log(`マッチ数: ${matchCount}`);

    // メッセージ数を取得
    const messageCount = await prisma.message.count();
    console.log(`メッセージ数: ${messageCount}`);

    // メッセージのサンプルを取得
    if (messageCount > 0) {
      const messages = await prisma.message.findMany({
        take: 3,
        include: {
          sender: true,
          receiver: true,
        },
      });
      
      console.log('\nメッセージのサンプル:');
      messages.forEach(msg => {
        console.log(`- ID: ${msg.id}`);
        console.log(`  送信者: ${msg.sender?.name || 'Unknown'} (${msg.senderId})`);
        console.log(`  受信者: ${msg.receiver?.name || 'Unknown'} (${msg.receiverId})`);
        console.log(`  内容: ${msg.content}`);
        console.log(`  作成日時: ${msg.createdAt}`);
        console.log('---');
      });
    } else {
      console.log('\nメッセージデータが存在しません。');
    }

  } catch (error) {
    console.error('データベース確認中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
