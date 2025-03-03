// check-environment.js
// Next.jsのAPI環境とノードスクリプトの環境の違いを調査するスクリプト

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const os = require('os');

async function checkEnvironment() {
  console.log('=== 環境変数とデータベース接続の調査 ===');
  
  // システム情報
  console.log('\n1. システム情報:');
  console.log(`OS: ${os.platform()} ${os.release()}`);
  console.log(`Node.js: ${process.version}`);
  console.log(`プロセスID: ${process.pid}`);
  console.log(`カレントディレクトリ: ${process.cwd()}`);
  
  // 環境変数
  console.log('\n2. 関連する環境変数:');
  console.log(`NODE_ENV: ${process.env.NODE_ENV || '未設定'}`);
  console.log(`DATABASE_URL: ${maskDatabaseUrl(process.env.DATABASE_URL || '未設定')}`);
  
  // プロジェクト構造
  console.log('\n3. プロジェクト構造:');
  const projectRoot = process.cwd();
  console.log(`プロジェクトルート: ${projectRoot}`);
  
  const prismaDir = path.join(projectRoot, 'prisma');
  console.log(`Prismaディレクトリ存在: ${fs.existsSync(prismaDir)}`);
  
  const schemaPath = path.join(prismaDir, 'schema.prisma');
  console.log(`schema.prisma存在: ${fs.existsSync(schemaPath)}`);
  
  // Prismaクライアント
  console.log('\n4. Prismaクライアント情報:');
  try {
    // スキーマ内容を確認
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const datasourceMatch = schemaContent.match(/datasource\s+db\s+{[^}]*provider\s*=\s*"([^"]+)"/);
    const provider = datasourceMatch ? datasourceMatch[1] : '不明';
    console.log(`データベースプロバイダー (schema.prisma): ${provider}`);
  } catch (error) {
    console.log(`スキーマ読み込みエラー: ${error.message}`);
  }
  
  // メッセージテーブル情報を取得
  try {
    console.log('\n5. メッセージテーブル調査:');
    
    // テーブル存在確認
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Message'
      );
    `;
    console.log(`Messageテーブル存在: ${tableExists[0].exists}`);
    
    // テーブル構造
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Message';
    `;
    console.log('テーブル構造:');
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });
    
    // 行数カウント
    const rowCountRaw = await prisma.$queryRaw`SELECT COUNT(*) AS count FROM "Message";`;
    console.log(`SQLによる行数: ${rowCountRaw[0].count}`);
    
    const rowCountORM = await prisma.message.count();
    console.log(`Prisma ORMによる行数: ${rowCountORM}`);
    
    // 最新のレコード
    const latestMessages = await prisma.message.findMany({ 
      take: 1,
      orderBy: { createdAt: 'desc' }
    });
    
    if (latestMessages.length > 0) {
      const latest = latestMessages[0];
      console.log(`最新メッセージID: ${latest.id}`);
      console.log(`作成日時: ${latest.createdAt}`);
    } else {
      console.log('メッセージが見つかりません');
    }
    
    // ユーザーテーブルの確認も行う
    console.log('\n6. ユーザーテーブル調査:');
    const userCount = await prisma.user.count();
    console.log(`ユーザー数: ${userCount}`);
    
    // マッチテーブルの確認
    console.log('\n7. マッチテーブル調査:');
    const matchCount = await prisma.match.count();
    console.log(`マッチ数: ${matchCount}`);
    
  } catch (error) {
    console.error('テーブル調査エラー:', error);
  }
  
  // 接続終了
  await prisma.$disconnect();
}

// データベースURLをマスク処理する関数
function maskDatabaseUrl(url) {
  if (!url || url === '未設定') return url;
  
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.username}:****@${parsedUrl.host}${parsedUrl.pathname}`;
  } catch (error) {
    return 'Invalid URL format';
  }
}

checkEnvironment();
