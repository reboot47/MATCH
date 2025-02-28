import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 写真データのサンプルURLリスト（男性用と女性用）
const malePhotoUrls = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
];

const femalePhotoUrls = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
  'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56',
];

// 写真をユーザーに追加する関数
async function addPhotosToUser(userId: string, gender: 'male' | 'female') {
  // ユーザーの既存の写真を確認
  const existingPhotos = await prisma.photo.count({
    where: { userId }
  });
  
  if (existingPhotos > 0) {
    console.log(`ユーザー ${userId} には既に写真があります。スキップします。`);
    return;
  }
  
  // 写真URLリストを選択
  const photoUrls = gender === 'male' ? malePhotoUrls : femalePhotoUrls;
  
  // 3-5枚のランダムな写真を追加
  const photoCount = 3 + Math.floor(Math.random() * 3);
  const selectedUrls = [...photoUrls].sort(() => 0.5 - Math.random()).slice(0, photoCount);
  
  console.log(`ユーザー ${userId} に ${photoCount}枚の写真を追加しています...`);
  
  // メイン写真を追加
  await prisma.photo.create({
    data: {
      userId,
      url: selectedUrls[0],
      isMain: true,
    }
  });
  
  // サブ写真を追加
  for (let i = 1; i < selectedUrls.length; i++) {
    await prisma.photo.create({
      data: {
        userId,
        url: selectedUrls[i],
        isMain: false,
      }
    });
  }
  
  console.log(`ユーザー ${userId} に ${selectedUrls.length}枚の写真を追加しました`);
}

// メイン関数
async function main() {
  console.log('ユーザーに写真データを追加しています...');
  
  // すべてのユーザーを取得
  const users = await prisma.user.findMany();
  console.log(`${users.length}人のユーザーが見つかりました`);
  
  // 各ユーザーに写真を追加
  for (const user of users) {
    const gender = user.gender as 'male' | 'female';
    if (gender) {
      await addPhotosToUser(user.id, gender);
    } else {
      console.log(`ユーザー ${user.id} の性別が不明です。スキップします。`);
    }
  }
  
  console.log('写真データの追加が完了しました');
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
