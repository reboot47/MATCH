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
  console.log('Cloudinaryアップロード開始');

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'image',
      folder: 'linebuzz',
      transformation: [
        { width: 800, crop: "limit" },
        { quality: "auto:good" }
      ]
    };

    console.log('Cloudinaryアップロードオプション:', uploadOptions);

    const uploadCallback = (error: any, result: any) => {
      if (error) {
        console.error('Cloudinaryアップロードエラー:', error);
        reject(error);
      } else {
        console.log('Cloudinaryアップロード成功:', result.secure_url);
        resolve(result.secure_url);
      }
    };

    try {
      cloudinary.uploader.upload_stream(uploadOptions, uploadCallback).end(buffer);
    } catch (streamError) {
      console.error('Cloudinaryストリームエラー:', streamError);
      reject(streamError);
    }
  });
}

// フォールバック：一時的にBase64データURLとして保存する関数
async function saveAsBase64(buffer: Buffer, mimeType: string): Promise<string> {
  console.log('Base64保存開始', { mimeType });
  const base64String = buffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64String}`;
  console.log('Base64保存完了', { dataUrlLength: dataUrl.length });
  return dataUrl;
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
    
    if (!file) {
      return new NextResponse(JSON.stringify({ error: 'ファイルが必要です' }), {
        status: 400,
      });
    }
    
    console.log('ファイル情報:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    
    // ファイルをバッファに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log('バッファ情報:', {
      length: buffer.length
    });
    
    let imageUrl;
    
    try {
      // まずCloudinaryにアップロードを試みる
      try {
        imageUrl = await uploadToCloudinary(buffer);
        console.log('Cloudinaryアップロード成功');
      } catch (cloudinaryError) {
        console.error('Cloudinaryアップロード失敗', cloudinaryError);
        
        // フォールバックとしてBase64で保存
        imageUrl = await saveAsBase64(buffer, file.type);
        console.log('Base64フォールバック保存完了');
      }
      
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
    } catch (uploadError) {
      console.error('アップロードプロセスエラー:', uploadError);
      return new NextResponse(JSON.stringify({ 
        error: 'アップロードプロセスエラー',
        details: uploadError instanceof Error ? uploadError.message : 'Unknown error'
      }), {
        status: 500,
      });
    }
  } catch (error) {
    console.error('写真アップロードエラー:', error);
    console.error('詳細なエラー情報:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return new NextResponse(JSON.stringify({ 
      error: 'サーバーエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
    });
  }
}
