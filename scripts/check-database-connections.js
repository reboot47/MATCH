// check-database-connections.js
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');

// PrismaのDatabaseURLを取得
const getDatabaseUrl = () => {
  try {
    // .envファイルを読み込む
    const envContent = fs.readFileSync('.env', 'utf8');
    const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
    if (dbUrlMatch && dbUrlMatch[1]) {
      // URLの重要な部分だけを表示（パスワードなどは隠す）
      const url = dbUrlMatch[1];
      const parsed = new URL(url);
      return `${parsed.protocol}//${parsed.username}:****@${parsed.host}${parsed.pathname}`;
    }
    return 'DATABASE_URL not found in .env';
  } catch (error) {
    return `Error reading .env: ${error.message}`;
  }
};

const prisma = new PrismaClient();

async function checkDatabaseConnections() {
  console.log('データベース接続テスト...');
  console.log(`現在のプロセス: ${process.pid}`);
  console.log(`環境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`データベースURL: ${getDatabaseUrl()}`);

  try {
    // Prisma接続テスト
    console.log('\n1. Prisma接続テスト:');
    await prisma.$connect();
    console.log('✅ Prisma接続成功');
    
    // テーブル一覧を取得
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public';
    `;
    console.log(`✅ テーブル一覧取得成功: ${tables.length}テーブル`);
    console.log('テーブル:', tables.map(t => t.tablename).join(', '));
    
    // メッセージテーブルの確認
    const messageCount = await prisma.message.count();
    console.log(`✅ Messageテーブル確認: ${messageCount}件のメッセージ`);
    
    // サンプルメッセージを取得
    if (messageCount > 0) {
      const messages = await prisma.message.findMany({ take: 1 });
      console.log('サンプルメッセージID:', messages[0].id);
    }
    
    // フィールド構造を確認
    try {
      const messageFields = await prisma.$queryRaw`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'Message';
      `;
      console.log('\nMessageテーブルのフィールド構造:');
      messageFields.forEach(field => {
        console.log(`- ${field.column_name}: ${field.data_type}`);
      });
    } catch (e) {
      console.error('フィールド構造の取得に失敗:', e);
    }
    
  } catch (error) {
    console.error('❌ データベース接続テスト失敗:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseConnections();
