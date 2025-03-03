// create-test-user.js
// テスト用のユーザーを作成するスクリプト

const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();

async function createTestUser() {
  console.log('🧪 テスト用ユーザー作成スクリプト');
  
  try {
    // テーブル構造の確認
    const userColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User';
    `;
    const userColumnNames = userColumns.map(col => col.column_name);
    console.log('Userテーブルのカラム:', userColumnNames);
    
    // 必須フィールドと任意フィールドを特定
    const requiredFields = ['id']; // 通常はIDが必須
    const optionalFields = userColumnNames.filter(name => !requiredFields.includes(name));
    
    console.log('必須フィールド:', requiredFields);
    console.log('任意フィールド:', optionalFields);
    
    // 新しいユーザーデータを作成
    const userData = {
      id: uuidv4()
    };
    
    // 任意フィールドを追加
    if (optionalFields.includes('name')) userData.name = 'テストユーザー2';
    if (optionalFields.includes('email')) userData.email = 'testuser2@example.com';
    if (optionalFields.includes('image')) userData.image = 'https://placehold.jp/150x150.png';
    if (optionalFields.includes('bio')) userData.bio = 'これはテストユーザーです。';
    if (optionalFields.includes('gender')) userData.gender = 'その他';
    if (optionalFields.includes('age')) userData.age = 25;
    if (optionalFields.includes('location')) userData.location = '東京';
    if (optionalFields.includes('occupation')) userData.occupation = 'エンジニア';
    if (optionalFields.includes('interests')) userData.interests = ['テクノロジー', '旅行'];
    
    // 日付フィールドの設定
    if (optionalFields.includes('createdAt')) userData.createdAt = new Date();
    if (optionalFields.includes('updatedAt')) userData.updatedAt = new Date();
    
    console.log('作成するユーザーデータ:', userData);
    
    // ユーザーの作成
    const newUser = await prisma.user.create({
      data: userData
    });
    
    console.log('✅ テストユーザーを作成しました:');
    console.log(`ID: ${newUser.id}`);
    if (newUser.name) console.log(`名前: ${newUser.name}`);
    if (newUser.email) console.log(`メール: ${newUser.email}`);
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
