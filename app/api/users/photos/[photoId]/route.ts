import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Cloudinaryの設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 写真の削除
export async function DELETE(
  request: Request,
  context: { params: { photoId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }
    
    const userId = session.user.id as string;
    const { photoId } = context.params;
    
    // 写真の所有者確認
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });
    
    if (!photo) {
      return new NextResponse(JSON.stringify({ error: '写真が見つかりません' }), {
        status: 404,
      });
    }
    
    if (photo.userId !== userId) {
      return new NextResponse(JSON.stringify({ error: '権限がありません' }), {
        status: 403,
      });
    }
    
    // Cloudinaryから写真を削除（URLからパブリックIDを抽出）
    try {
      if (photo.url) {
        // Cloudinary URLからパブリックIDを抽出
        // 例: https://res.cloudinary.com/CLOUD_NAME/image/upload/v1234567890/folder/public_id.jpg
        // URLパターンを解析して適切なパブリックIDを取得
        let publicId = '';
        
        // Cloudinaryの一般的なURL形式を処理
        if (photo.url.includes('/upload/')) {
          const uploadIndex = photo.url.indexOf('/upload/');
          if (uploadIndex !== -1) {
            // /upload/ 以降の部分を取得
            const afterUpload = photo.url.substring(uploadIndex + 8); // 8 = '/upload/'.length
            
            // バージョン番号を削除 (v1234567890/ のようなパターン)
            const withoutVersion = afterUpload.replace(/v\d+\//, '');
            
            // 拡張子を削除
            publicId = withoutVersion.replace(/\.[^.]+$/, '');
          }
        } else {
          // フォールバック: 最後のパスコンポーネントを使用
          const urlParts = photo.url.split('/');
          const lastPart = urlParts[urlParts.length - 1];
          publicId = lastPart.split('.')[0];
        }
        
        console.log('Deleting from Cloudinary. PublicID:', publicId);
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (cloudinaryError) {
      console.error('Cloudinary削除エラー:', cloudinaryError);
      // Cloudinaryでのエラーがあってもデータベースからは削除を続行
    }
    
    // データベースから写真を削除
    await prisma.photo.delete({
      where: { id: photoId },
    });
    
    return NextResponse.json({
      message: '写真が正常に削除されました'
    });
  } catch (error) {
    console.error('写真削除エラー:', error);
    return new NextResponse(JSON.stringify({ error: 'サーバーエラーが発生しました' }), {
      status: 500,
    });
  }
}

// 写真の更新（メイン写真に設定）
export async function PATCH(
  request: Request,
  context: { params: { photoId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }
    
    const userId = session.user.id as string;
    const { photoId } = context.params;
    
    // 写真の所有者確認
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });
    
    if (!photo) {
      return new NextResponse(JSON.stringify({ error: '写真が見つかりません' }), {
        status: 404,
      });
    }
    
    if (photo.userId !== userId) {
      return new NextResponse(JSON.stringify({ error: '権限がありません' }), {
        status: 403,
      });
    }
    
    const body = await request.json();
    const { isMain } = body;
    
    // メイン写真に設定する場合は既存のメイン写真をリセット
    if (isMain) {
      await prisma.photo.updateMany({
        where: {
          userId,
          isMain: true,
        },
        data: {
          isMain: false,
        },
      });
    }
    
    // 写真を更新
    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: { isMain: isMain === true },
    });
    
    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error('写真更新エラー:', error);
    return new NextResponse(JSON.stringify({ error: 'サーバーエラーが発生しました' }), {
      status: 500,
    });
  }
}
