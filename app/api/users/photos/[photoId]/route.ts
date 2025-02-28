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
        let publicId = '';
        
        const url = photo.url;
        const urlParts = url.split('/');
        const fileNameWithExt = urlParts[urlParts.length - 1];
        const fileName = fileNameWithExt.split('.')[0];
        
        // folder/filename 形式で取得
        const folderIndex = url.indexOf('/upload/') + 8; // '/upload/'.length = 8
        if (folderIndex !== -1) {
          const pathAfterUpload = url.substring(folderIndex);
          // バージョン番号 (v1234567890/) があれば削除
          publicId = pathAfterUpload.replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');
        } else {
          // フォールバック: ファイル名のみを使用
          publicId = fileName;
        }
        
        console.log('Deleting from Cloudinary. PublicID:', publicId);
        
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          console.log('Cloudinary削除結果:', result);
        } catch (cloudinaryError) {
          console.error('Cloudinary削除エラー:', cloudinaryError);
          // Cloudinaryでのエラーはログに記録するが、処理は続行
        }
      }
    } catch (cloudinaryError) {
      console.error('Cloudinary処理エラー:', cloudinaryError);
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
