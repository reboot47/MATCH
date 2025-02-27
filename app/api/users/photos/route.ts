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

// 一時的なバッファをCloudinaryにアップロードする関数
async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  console.log('Cloudinaryアップロード開始', {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'image',
      folder: 'paters',
    };

    const uploadCallback = (error: any, result: any) => {
      if (error) {
        console.error('Cloudinaryアップロードエラー:', error);
        reject(error);
      } else {
        console.log('Cloudinaryアップロード成功:', result.secure_url);
        resolve(result.secure_url);
      }
    };

    cloudinary.uploader.upload_stream(uploadOptions, uploadCallback).end(buffer);
  });
}

// 写真のアップロード
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 認証チェック
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }
    
    const userId = session.user.id as string;
    
    // FormDataからファイルとパラメータを取得
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const isMainStr = formData.get('isMain') as string;
    const isMain = isMainStr === 'true';
    
    console.log('写真アップロードリクエスト', {
      userId,
      isMain,
      hasFile: !!file,
      fileType: file?.type,
      fileSize: file?.size
    });
    
    if (!file) {
      return new NextResponse(JSON.stringify({ error: 'ファイルが必要です' }), {
        status: 400,
      });
    }
    
    try {
      // ファイルをバッファに変換
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      console.log('ファイルをバッファに変換しました', {
        bufferLength: buffer.length
      });
      
      // Cloudinaryにアップロード
      const imageUrl = await uploadToCloudinary(buffer);
      
      // もしメイン写真なら、他のメイン写真をメインでなくする
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
      
      // データベースに写真情報を保存
      const photo = await prisma.photo.create({
        data: {
          userId,
          url: imageUrl,
          isMain,
        },
      });
      
      return NextResponse.json({
        id: photo.id,
        url: photo.url,
        isMain: photo.isMain,
      });
    } catch (innerError) {
      console.error('ファイル処理エラー:', innerError);
      throw new Error(`ファイル処理中にエラーが発生しました: ${innerError instanceof Error ? innerError.message : '不明なエラー'}`);
    }
  } catch (error) {
    console.error('写真アップロードエラー:', error);
    
    // エラーの詳細を含める
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}` 
      : '不明なエラーが発生しました';
      
    return new NextResponse(JSON.stringify({ 
      error: 'サーバーエラーが発生しました', 
      details: errorMessage 
    }), {
      status: 500,
    });
  }
}
