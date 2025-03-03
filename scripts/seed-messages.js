// seed-messages.js
// リモートデータベースにテストメッセージを追加するスクリプト

const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();

async function seedMessages() {
  console.log('🌱 メッセージシードスクリプトを開始...');

  try {
    // データベース接続の確認
    console.log('💻 データベース接続の確認...');
    const dbUrl = process.env.DATABASE_URL;
    console.log(`DATABASE_URL: ${maskDatabaseUrl(dbUrl)}`);

    // ユーザー数の確認
    const userCount = await prisma.user.count();
    console.log(`現在のユーザー数: ${userCount}`);

    // テーブル構造の確認
    const userColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User';
    `;
    const userColumnNames = userColumns.map(col => col.column_name);
    console.log('Userテーブルのカラム:', userColumnNames);

    // 直接スキーマ情報を取得
    const idFieldExists = userColumnNames.includes('id');
    const nameFieldExists = userColumnNames.includes('name');
    const emailFieldExists = userColumnNames.includes('email');
    
    console.log(`id フィールド存在: ${idFieldExists}`);
    console.log(`name フィールド存在: ${nameFieldExists}`);
    console.log(`email フィールド存在: ${emailFieldExists}`);

    if (userCount === 0) {
      console.log('⚠️ ユーザーが存在しないため、テストユーザーを作成します...');
      
      // テストユーザーの作成 - 動的にフィールドを構成
      const user1Data = {
        id: uuidv4()
      };
      
      if (nameFieldExists) user1Data.name = 'テストユーザー1';
      if (emailFieldExists) user1Data.email = 'user1@example.com';
      
      const user1 = await prisma.user.create({
        data: user1Data
      });

      const user2Data = {
        id: uuidv4()
      };
      
      if (nameFieldExists) user2Data.name = 'テストユーザー2';
      if (emailFieldExists) user2Data.email = 'user2@example.com';
      
      const user2 = await prisma.user.create({
        data: user2Data
      });

      console.log(`✅ テストユーザーを作成しました: ${user1.id}, ${user2.id}`);
      
      // マッチテーブルのカラム確認
      const matchColumns = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'Match';
      `;
      const matchColumnNames = matchColumns.map(col => col.column_name);
      console.log('Matchテーブルのカラム:', matchColumnNames);
      
      // テストマッチの作成
      const matchData = {
        id: uuidv4(),
        user1Id: user1.id,
        user2Id: user2.id
      };
      
      if (matchColumnNames.includes('status')) matchData.status = 'MATCHED';
      
      const match = await prisma.match.create({
        data: matchData
      });

      console.log(`✅ テストマッチを作成しました: ${match.id}`);
      
      // メッセージテーブルのカラム確認
      const messageColumns = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'Message';
      `;
      const messageColumnNames = messageColumns.map(col => col.column_name);
      console.log('Messageテーブルのカラム:', messageColumnNames);
      
      // テストメッセージの作成
      for (let i = 0; i < 5; i++) {
        const messageData = {
          id: uuidv4(),
          senderId: i % 2 === 0 ? user1.id : user2.id,
          receiverId: i % 2 === 0 ? user2.id : user1.id,
          matchId: match.id,
          content: `これはテストメッセージ ${i + 1} です。`
        };
        
        if (messageColumnNames.includes('read')) messageData.read = i < 3;
        
        await prisma.message.create({
          data: messageData
        });
      }
      
      console.log('✅ 5件のテストメッセージを作成しました');
    } else {
      console.log('既存のユーザーを使用します...');
      
      // 既存のユーザーを取得 - 安全なクエリを使用
      const users = await prisma.$queryRaw`
        SELECT id FROM "User" LIMIT 2;
      `;
      
      if (users.length < 2) {
        console.log('⚠️ テストに必要な最低2人のユーザーが見つかりません');
        return;
      }
      
      const user1Id = users[0].id;
      const user2Id = users.length > 1 ? users[1].id : user1Id;
      
      console.log(`使用するユーザーID: ${user1Id}, ${user2Id}`);
      
      // マッチテーブルが存在するか確認
      const matchTableExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'Match'
        );
      `;
      
      let matchId;
      
      if (matchTableExists[0].exists) {
        // マッチの確認
        const matches = await prisma.$queryRaw`
          SELECT id FROM "Match" 
          WHERE ("user1Id" = ${user1Id} AND "user2Id" = ${user2Id})
          OR ("user1Id" = ${user2Id} AND "user2Id" = ${user1Id})
          LIMIT 1;
        `;
        
        // マッチがなければ作成
        if (matches.length === 0) {
          const newMatch = await prisma.match.create({
            data: {
              id: uuidv4(),
              user1Id: user1Id,
              user2Id: user2Id,
              status: 'MATCHED',
            }
          });
          matchId = newMatch.id;
          console.log(`✅ テストマッチを作成しました: ${matchId}`);
        } else {
          matchId = matches[0].id;
          console.log(`既存のマッチを使用します: ${matchId}`);
        }
      } else {
        console.log('⚠️ Matchテーブルが存在しません');
        matchId = uuidv4(); // ダミーID
      }
      
      // テストメッセージの作成
      console.log('テストメッセージを作成中...');
      for (let i = 0; i < 5; i++) {
        await prisma.message.create({
          data: {
            id: uuidv4(),
            senderId: i % 2 === 0 ? user1Id : user2Id,
            receiverId: i % 2 === 0 ? user2Id : user1Id,
            matchId: matchId,
            content: `これはテストメッセージ ${i + 1} です。`,
            read: i < 3,
          }
        });
      }
      
      console.log('✅ 5件のテストメッセージを作成しました');
    }
    
    // 確認
    const messageCount = await prisma.message.count();
    console.log(`現在のメッセージ数: ${messageCount}`);
    
    if (messageCount > 0) {
      const messages = await prisma.message.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          senderId: true,
          receiverId: true,
          createdAt: true
        }
      });
      
      console.log('最新の3件のメッセージ:');
      messages.forEach((msg, i) => {
        console.log(`${i+1}. 送信者ID: ${msg.senderId.substring(0, 8)}... -> 受信者ID: ${msg.receiverId.substring(0, 8)}...: ${msg.content}`);
      });
    }
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔄 データベース接続を切断しました');
  }
}

// データベースURLをマスク処理する関数
function maskDatabaseUrl(url) {
  if (!url) return '[未設定]';
  
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.username}:****@${parsedUrl.host}${parsedUrl.pathname}`;
  } catch (error) {
    return '[無効なURL形式]';
  }
}

seedMessages();
