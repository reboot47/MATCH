import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Cloudinaryの設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true, // HTTPSを使用
});

// 設定値を確認（秘密情報は表示しない）
console.log('Cloudinary設定確認:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'not set',
  api_key: process.env.CLOUDINARY_API_KEY ? 'set (hidden)' : 'not set',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'set (hidden)' : 'not set',
});

// Cloudinaryに動画をアップロードする関数
async function uploadVideoToCloudinary(buffer: Buffer, originalFileName: string): Promise<{ url: string, thumbnailUrl: string }> {
  console.log('動画アップロード開始:', { originalFileName });
  
  // ファイル拡張子を確認
  const isMovFile = originalFileName.toLowerCase().endsWith('.mov');
  console.log('ファイル形式チェック:', { isMovFile });

  // 動画本体をアップロード
  const videoUploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'linebuzz',
        // すべての動画をMP4形式に統一（特にMOVファイルの場合）
        format: 'mp4',
        // 追加の変換パラメータ
        transformation: [
          { width: 720, crop: 'limit' },
          { quality: 'auto:good' },
          { audio_codec: 'aac' },
          { video_codec: 'h264' }
        ],
        // MP4に変換するためのオプションフラグ
        eager_async: false,
        eager_notification_url: null,
        overwrite: true
      },
      (error, result) => {
        if (error) {
          console.error('動画アップロードエラー:', error);
          reject(error);
          return;
        }
        
        console.log('動画アップロード成功:', result?.secure_url);
        resolve(result);
      }
    ).end(buffer);
  });

  // URLを確認（必ずMP4形式であることを確認）
  let videoUrl = videoUploadResult.secure_url;
  
  // URLが.mp4で終わっていない場合は修正
  if (!videoUrl.toLowerCase().endsWith('.mp4')) {
    // 元の拡張子を.mp4に置き換え
    videoUrl = videoUrl.replace(/\.[^/.]+$/, '.mp4');
    console.log('URLをMP4形式に修正:', videoUrl);
  }

  // サムネイルを生成（明示的に動画の一フレームを抽出）
  const thumbnailUrl = cloudinary.url(videoUploadResult.public_id, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
      { quality: 'auto:good' },
      { start_offset: '1' }  // 1秒地点のフレームを取得
    ]
  });

  console.log('動画サムネイル生成:', {
    videoPublicId: videoUploadResult.public_id,
    thumbnailUrl
  });

  return {
    url: videoUrl,
    thumbnailUrl
  };
}

// Cloudinaryにメディアをアップロードする関数
async function uploadToCloudinary(buffer: Buffer, fileType: string = 'image'): Promise<{ url: string, thumbnailUrl?: string }> {
  console.log(`Cloudinary ${fileType} アップロード開始`);
  const isVideo = fileType === 'video';

  // 設定の検証
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary設定が不完全です');
    throw new Error('Cloudinary configuration incomplete');
  }

  // Cloudinaryのconfigを再設定
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log('Cloudinary環境変数確認:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '設定済み' : '未設定',
    api_key: process.env.CLOUDINARY_API_KEY ? '設定済み' : '未設定',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '設定済み' : '未設定',
  });

  // 別の方法でアップロードを試みる
  if (isVideo) {
    try {
      // パラメータをアップロード関数に渡す
      return await uploadVideoToCloudinary(buffer, file.name);
    } catch (err) {
      console.error('動画アップロード例外:', err);
      throw err;
    }
  } else {
    // 画像の場合は従来の方法
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: 'image',
        folder: 'linebuzz'
      };
      
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('画像アップロードエラー:', error);
            reject(error);
            return;
          }
          
          resolve({ url: result.secure_url });
        }
      ).end(buffer);
    });
  }
}

// フォールバック：一時的にBase64データURLとして保存する関数
async function saveAsBase64(buffer: Buffer, mimeType: string): Promise<{ url: string }> {
  console.log('Base64保存開始', { mimeType });
  const base64String = buffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64String}`;
  console.log('Base64保存完了', { dataUrlLength: dataUrl.length });
  return { url: dataUrl };
}

// 写真・動画のアップロード
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
    const fileType = formData.get('fileType') as string || 'image';
    
    if (!file) {
      return new NextResponse(JSON.stringify({ error: 'ファイルが必要です' }), {
        status: 400,
      });
    }
    
    console.log('ファイル情報:', {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadType: fileType
    });
    
    // ファイルをバッファに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log('バッファ情報:', {
      length: buffer.length
    });
    
    let uploadResult: { url: string, thumbnailUrl?: string };
    
    try {
      // Cloudinaryを試みる
      const isVideo = file.type.startsWith('video/') || fileType === 'video';
      uploadResult = await uploadToCloudinary(buffer, isVideo ? 'video' : 'image');
      console.log('Cloudinaryアップロード成功', uploadResult);
    } catch (cloudinaryError) {
      console.error('Cloudinaryアップロード失敗', cloudinaryError);
      
      // 一時的な対処: Base64エンコードを使用（サイズ制限のため本番環境では推奨されません）
      const isVideo = file.type.startsWith('video/') || fileType === 'video';
      console.log('Base64フォールバックを使用', { isVideo });
      
      // 動画と画像の両方で一時的にBase64を使用
      uploadResult = await saveAsBase64(buffer, file.type);
      
      // 動画の場合は、サムネイルも必要なので、SVGベースのプレースホルダー画像を使用する
      if (isVideo) {
        // SVGベースのシンプルな動画アイコンプレースホルダー
        uploadResult.thumbnailUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PHBhdGggZD0iTTE2MCwxMzAgbDgwLDUwIC04MCw1MCB6IiBmaWxsPSIjYjBiMGIwIi8+PC9zdmc+';
        console.log('フォールバック動画サムネイル:', uploadResult.thumbnailUrl);
      }
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
    
    // データベースに写真・動画情報を保存
    const photoData = {
      userId,
      url: uploadResult.url,
      isMain,
      type: file.type.startsWith('video/') || fileType === 'video' ? 'video' : 'image',
      thumbnailUrl: uploadResult.thumbnailUrl
    };
    
    console.log('データベースに保存するデータ:', photoData);
    
    const photo = await prisma.photo.create({
      data: photoData,
    });
    
    // サムネイルがあればその情報をログに出力
    if (photoData.type === 'video' && photo.thumbnailUrl) {
      console.log('動画サムネイル情報をデータベースに保存:', photo.thumbnailUrl);
    }
    
    return NextResponse.json({
      id: photo.id,
      url: photo.url,
      isMain: photo.isMain,
      type: photoData.type,
      thumbnailUrl: photo.thumbnailUrl
    });
  } catch (error) {
    console.error('メディアアップロードエラー:', error);
    console.error('詳細なエラー情報:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return new NextResponse(JSON.stringify({ 
      error: 'サーバーエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
    });
  }
}
