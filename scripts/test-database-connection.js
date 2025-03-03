// test-database-connection.js
// データベース接続とメッセージ取得を詳細にテストするスクリプト
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('=== データベース接続テスト ===');
  
  try {
    console.log('1. 接続テスト開始...');
    await prisma.$connect();
    console.log('✓ データベースに正常に接続しました');

    // 全テーブルを取得
    console.log('\n2. データベーステーブル一覧の取得:');
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public';
    `;
    const tableNames = tables.map(t => t.tablename).join(', ');
    console.log(`✓ ${tables.length}個のテーブルが見つかりました: ${tableNames}`);

    // Messageテーブルの行数を確認 (SQL)
    console.log('\n3. Messageテーブルの行数確認 (SQL):');
    const rawCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Message"`;
    console.log(`✓ SQL COUNT結果: ${rawCount[0].count}件`);

    // Messageテーブルの行数を確認 (Prisma)
    console.log('\n4. Messageテーブルの行数確認 (Prisma ORM):');
    const count = await prisma.message.count();
    console.log(`✓ Prisma count結果: ${count}件`);

    // Messageテーブルのサンプルデータを取得 (SQL)
    console.log('\n5. Messageテーブルのサンプルデータを取得 (SQL):');
    const sampleMessages = await prisma.$queryRaw`SELECT id, content FROM "Message" LIMIT 3`;
    if (sampleMessages.length > 0) {
      sampleMessages.forEach((msg, i) => {
        console.log(`✓ サンプル ${i+1}: ID=${msg.id}, 内容=${msg.content.substring(0, 30)}...`);
      });
    } else {
      console.log('× サンプルメッセージが見つかりませんでした');
    }

    // Messageテーブルのサンプルデータを取得 (Prisma)
    console.log('\n6. Messageテーブルのサンプルデータを取得 (Prisma ORM):');
    const messages = await prisma.message.findMany({
      take: 3,
      include: {
        sender: true,
        receiver: true
      }
    });
    
    if (messages.length > 0) {
      messages.forEach((msg, i) => {
        console.log(`✓ サンプル ${i+1}: ID=${msg.id}, 送信者=${msg.sender?.name || 'Unknown'}, 内容=${msg.content.substring(0, 30)}...`);
      });
    } else {
      console.log('× Prismaでメッセージが見つかりませんでした');
    }
    
    // Userテーブルの行数を確認
    console.log('\n7. Userテーブルの確認:');
    const userCount = await prisma.user.count();
    console.log(`✓ ${userCount}人のユーザーが見つかりました`);
    
    if (userCount > 0) {
      const sampleUsers = await prisma.user.findMany({ take: 3 });
      sampleUsers.forEach((user, i) => {
        console.log(`✓ ユーザーサンプル ${i+1}: ID=${user.id}, 名前=${user.name || 'No name'}`);
      });
    }
    
    console.log('\n8. データベーススキーマの検証:');
    // "message"と"Message"のどちらが正しいか確認
    try {
      const lowercase = await prisma.$queryRaw`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'message')`;
      const uppercase = await prisma.$queryRaw`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Message')`;
      console.log(`✓ テーブル 'message' (小文字) 存在: ${lowercase[0].exists}`);
      console.log(`✓ テーブル 'Message' (大文字) 存在: ${uppercase[0].exists}`);
    } catch (err) {
      console.error('× スキーマ検証エラー:', err.message);
    }
    
  } catch (error) {
    console.error('× データベーステストでエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
