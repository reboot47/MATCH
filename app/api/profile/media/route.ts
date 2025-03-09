import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { uploadBatch, deleteImage, deleteVideo, cloudinary } from '@/lib/cloudinary';

// メディアアップロードエンドポイント
export async function POST(req: NextRequest) {
  try {
    console.log('Media upload API endpoint called');
    
    // Cloudinaryの設定を確認
    const cloudinaryConfig = cloudinary.config();
    console.log('Cloudinary config in API:', { 
      cloud_name: cloudinaryConfig.cloud_name,
      api_key: cloudinaryConfig.api_key ? '[SET]' : '[NOT SET]',
      api_secret: cloudinaryConfig.api_secret ? '[SET]' : '[NOT SET]'
    });
    
    // 認証を取得
    const session = await auth();
    console.log('Session in API:', session ? 'Session exists' : 'No session');
    
    if (!session || !session.user.id) {
      console.log('Authentication failed - no valid session');
      return NextResponse.json(
        { error: '認証されていません' }, 
        { status: 401 }
      );
    }
    
    console.log('User authenticated:', session.user.id);
    
    // ユーザーが実際に存在するか確認
    const userExists = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });
    
    if (!userExists) {
      console.log('User exists in session but not in database. Debug mode detected.');
      // デバッグモードの場合はモックレスポンスを返す
      return NextResponse.json({ 
        success: true, 
        mediaItems: [
          {
            id: 'mock-media-1',
            url: 'https://res.cloudinary.com/dslf46nht/image/upload/v1741279450/demo/images/sample.jpg',
            type: 'image',
            publicId: 'mock-public-id',
            isPrimary: true,
            sortOrder: 0
          }
        ],
        debugMode: true
      }, { status: 200 });
    }
    
    // FormDataからファイルとメタデータを解析
    const formData = await req.formData();
    console.log('FormData keys:', [...formData.keys()]);
    
    const files: Array<{ file: string; type: 'image' | 'video' }> = [];
    
    // ユーザーの現在のメディア数を確認
    const userMediaCount = await db.mediaItem.count({
      where: { userId: session.user.id }
    });
    console.log('Current user media count:', userMediaCount);
    
    const maxMediaCount = 9; // 最大メディア数
    
    // フォームから複数ファイルデータを取得
    for (let i = 0; formData.has(`file${i}`); i++) {
      const file = formData.get(`file${i}`) as File;
      const fileType = formData.get(`type${i}`) as 'image' | 'video';
      
      if (!file) {
        console.log(`No file found for file${i}`);
        continue;
      }
      
      console.log(`Processing file${i}: ${file.name}, type: ${file.type}, size: ${file.size}`);
      
      // ファイルサイズの制限（画像:10MB、動画:50MB）
      const maxSize = fileType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        console.log(`File size exceeds limit: ${file.size} > ${maxSize}`);
        return NextResponse.json({
          error: `${fileType === 'video' ? '動画' : '画像'}のサイズが大きすぎます。${fileType === 'video' ? '50MB' : '10MB'}以下にしてください。`
        }, { status: 400 });
      }
      
      // ファイル形式の検証
      if (fileType === 'image' && !file.type.startsWith('image/')) {
        console.log(`Invalid image type: ${file.type}`);
        return NextResponse.json({
          error: '無効な画像形式です。JPG、PNG、GIF形式をアップロードしてください。'
        }, { status: 400 });
      }
      
      if (fileType === 'video' && !file.type.startsWith('video/')) {
        console.log(`Invalid video type: ${file.type}`);
        return NextResponse.json({
          error: '無効な動画形式です。MP4、WebM、Ogg形式をアップロードしてください。'
        }, { status: 400 });
      }
      
      try {
        // ファイルをBase64に変換
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
        console.log(`File ${file.name} converted to base64 (length: ${base64.length})`);
        
        files.push({
          file: base64,
          type: fileType || (file.type.startsWith('video/') ? 'video' : 'image')
        });
      } catch (error) {
        console.error(`Error converting file ${file.name} to base64:`, error);
        return NextResponse.json({
          error: 'ファイルの処理中にエラーが発生しました。'
        }, { status: 500 });
      }
    }
    
    console.log(`Processed ${files.length} files`);
    
    if (files.length === 0) {
      console.log('No valid files found in request');
      return NextResponse.json(
        { error: 'ファイルが見つかりません' }, 
        { status: 400 }
      );
    }
    
    // 最大メディア数のチェック
    if (userMediaCount + files.length > maxMediaCount) {
      console.log(`Exceeds max media count: ${userMediaCount} + ${files.length} > ${maxMediaCount}`);
      return NextResponse.json({
        error: `メディアは最大${maxMediaCount}個までアップロードできます。現在${userMediaCount}個のメディアがあります。`
      }, { status: 400 });
    }
    
    // Cloudinaryにアップロード
    const folder = `linebuzz/${session.user.id}`;
    console.log(`Uploading to Cloudinary folder: ${folder}`);
    
    const uploadedFiles = await uploadBatch(files, folder);
    console.log(`Successfully uploaded ${uploadedFiles.length} files to Cloudinary`);
    
    // データベースに保存
    const mediaItems = await Promise.all(
      uploadedFiles.map(async (file, index) => {
        console.log(`Saving to database: ${file.url}, type: ${file.type}`);
        return await db.mediaItem.create({
          data: {
            userId: session.user.id,
            url: file.url,
            publicId: file.publicId,
            type: file.type,
            thumbnail: file.thumbnail,
            isPrimary: userMediaCount === 0 && index === 0, // 最初のアップロードなら最初のアイテムをプライマリに
            sortOrder: userMediaCount + index, // 既存のメディア数 + インデックスで順序を設定
          }
        });
      })
    );
    
    console.log(`Successfully saved ${mediaItems.length} media items to database`);
    
    // 正常なレスポンスを返す
    return NextResponse.json({ success: true, mediaItems }, { status: 200 });
  } catch (error) {
    console.error('メディアアップロードエラー:', error);
    return NextResponse.json(
      { error: 'メディアのアップロードに失敗しました' }, 
      { status: 500 }
    );
  }
}

// メディア更新エンドポイント
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: '認証されていません' }, 
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { mediaItems } = body;
    
    if (!mediaItems || !Array.isArray(mediaItems)) {
      return NextResponse.json(
        { error: '無効なリクエスト形式' }, 
        { status: 400 }
      );
    }
    
    // ユーザーのメディア項目を取得
    const userMediaItems = await db.mediaItem.findMany({
      where: { userId: session.user.id }
    });
    
    // 更新オペレーション
    const updateOperations = mediaItems.map(async (item: any) => {
      // アイテムIDが存在するか検証
      const existingItem = userMediaItems.find(
        media => media.id === item.id
      );
      
      if (!existingItem) {
        return null; // このアイテムはユーザーのものではない
      }
      
      // 既存のプライマリアイテムを非プライマリに変更
      if (item.isPrimary && existingItem.isPrimary !== item.isPrimary) {
        await db.mediaItem.updateMany({
          where: { 
            userId: session.user.id,
            isPrimary: true 
          },
          data: { isPrimary: false }
        });
      }
      
      // アイテムを更新
      return await db.mediaItem.update({
        where: { id: item.id },
        data: {
          caption: item.caption,
          isPrimary: item.isPrimary,
          sortOrder: item.sortOrder
        }
      });
    });
    
    const updatedItems = await Promise.all(updateOperations);
    
    return NextResponse.json(
      { success: true, mediaItems: updatedItems.filter(Boolean) }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('メディア更新エラー:', error);
    return NextResponse.json(
      { error: 'メディアの更新に失敗しました' }, 
      { status: 500 }
    );
  }
}

// メディア削除エンドポイント
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: '認証されていません' }, 
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const mediaId = url.searchParams.get('id');
    
    if (!mediaId) {
      return NextResponse.json(
        { error: 'メディアIDが指定されていません' }, 
        { status: 400 }
      );
    }
    
    // メディアアイテムを取得
    const mediaItem = await db.mediaItem.findFirst({
      where: {
        id: mediaId,
        userId: session.user.id
      }
    });
    
    if (!mediaItem) {
      return NextResponse.json(
        { error: 'メディアが見つからないか、削除権限がありません' }, 
        { status: 404 }
      );
    }
    
    // Cloudinaryから削除
    if (mediaItem.type === 'video') {
      await deleteVideo(mediaItem.publicId);
    } else {
      await deleteImage(mediaItem.publicId);
    }
    
    // データベースから削除
    await db.mediaItem.delete({
      where: { id: mediaId }
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('メディア削除エラー:', error);
    return NextResponse.json(
      { error: 'メディアの削除に失敗しました' }, 
      { status: 500 }
    );
  }
}
