// fix-admin-messages.js
// 管理者メッセージAPIを修正するスクリプト
// 問題：スタンドアロンスクリプトとNext.jsアプリが異なるデータベースURLを使用している

// 既存のAPIルートをそのまま使用し、手動でデータベースURLを指定

const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

async function fixAdminMessages() {
  console.log('🔧 管理者メッセージAPI修正スクリプト');
  
  // Next.jsアプリが使用しているデータベースURL
  const nextjsDbUrl = "postgresql://deve_owner:PASSWORD@ep-spring-sound-a1z9sami-pooler.ap-southeast-1.aws.neon.tech/deve";
  
  // ここでPASSWORDを実際のパスワードに置き換える必要があります
  // セキュリティ上の理由から、このスクリプトではパスワードをハードコードしていません
  console.log('❗ 実行前に、スクリプト内のPASSWORD部分を実際のパスワードに置き換えてください');
  
  try {
    // 既存の.envファイルのバックアップ作成を推奨
    console.log('📝 提案: 既存の.envファイルをバックアップすることをお勧めします：');
    console.log('   cp .env .env.backup');
    
    // 解決策の提案
    console.log('\n🔍 問題の分析:');
    console.log('1. スタンドアロンスクリプトは .env ファイルから DATABASE_URL を読み込んでいます:');
    console.log('   postgresql://postgres@localhost:5432/linebuzz?schema=public');
    console.log('2. Next.jsアプリは異なるデータベースURLを使用しています:');
    console.log('   postgresql://deve_owner:****@ep-spring-sound-a1z9sami-pooler.ap-southeast-1.aws.neon.tech/deve');
    
    console.log('\n💡 解決策の選択肢:');
    console.log('A. Next.jsアプリの環境変数設定を変更して、ローカルデータベースを使用する');
    console.log('B. .envファイルを更新して、Next.jsアプリが使用しているリモートデータベースを使用する');
    console.log('C. データベースの同期を行い、両方のデータベースで同じデータが利用できるようにする');
    
    console.log('\n📊 解決策B（.envファイルの更新）を実施するには:');
    console.log('1. .envファイル内のDATABASE_URLを次のように変更します:');
    console.log(`   DATABASE_URL="${nextjsDbUrl}"`);
    console.log('2. Prismaスキーマを更新して再生成します:');
    console.log('   npx prisma generate');
    console.log('3. アプリケーションを再起動します:');
    console.log('   npm run dev');
  } catch (error) {
    console.error('❌ エラー:', error.message);
  }
}

fixAdminMessages();
