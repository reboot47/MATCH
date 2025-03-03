// create-match.js
// マッチデータを作成するシンプルなスクリプト

const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();

async function createMatch() {
  console.log('👥 マッチ作成スクリプト');
  
  try {
    // ユーザー確認
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      },
      take: 2
    });
    
    if (users.length < 2) {
      console.log('⚠️ 最低2人のユーザーが必要です');
      return;
    }
    
    console.log('既存のユーザー:');
    users.forEach((user, i) => {
      console.log(`${i+1}. ${user.name || 'No Name'} (${user.id})`);
    });
    
    // マッチテーブル構造確認
    const matchColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Match';
    `;
    console.log('Matchテーブルのカラム:', matchColumns.map(col => col.column_name));
    
    // Match作成のためのクエリを実行
    console.log('マッチを作成中...');
    
    const matchId = uuidv4();
    
    // まずマッチを作成
    const match = await prisma.match.create({
      data: {
        id: matchId,
        // usersはMany-to-Manyなので直接追加できない
      }
    });
    
    console.log(`マッチ作成: ${match.id}`);
    
    // 次にManyToManyの関連付けを行う
    // _MatchToUserテーブルの確認
    const joinTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '_MatchToUser'
      );
    `;
    
    if (joinTableExists[0].exists) {
      console.log('_MatchToUserテーブル存在を確認');
      
      // 中間テーブルのカラム確認
      const joinColumns = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = '_MatchToUser';
      `;
      console.log('中間テーブルのカラム:', joinColumns.map(col => col.column_name));
      
      // 直接SQL文で関連付けを追加
      await prisma.$executeRaw`
        INSERT INTO "_MatchToUser" ("A", "B")
        VALUES (${match.id}, ${users[0].id}), (${match.id}, ${users[1].id})
      `;
      
      console.log('ユーザーをマッチに関連付けました');
    } else {
      console.log('⚠️ _MatchToUserテーブルが存在しません');
    }
    
    // テスト用のメッセージを作成
    console.log('テストメッセージを作成中...');
    
    for (let i = 0; i < 5; i++) {
      const message = await prisma.message.create({
        data: {
          id: uuidv4(),
          content: `テストメッセージ ${i+1}`,
          senderId: i % 2 === 0 ? users[0].id : users[1].id,
          receiverId: i % 2 === 0 ? users[1].id : users[0].id,
          matchId: match.id,
          read: i < 3,
        }
      });
      
      console.log(`メッセージ作成: ${message.id.substring(0, 8)}...`);
    }
    
    // 確認
    const messageCount = await prisma.message.count({
      where: {
        matchId: match.id
      }
    });
    
    console.log(`作成されたメッセージ数: ${messageCount}`);
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMatch();
