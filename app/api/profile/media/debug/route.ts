import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { uploadImage } from '@/lib/cloudinary';

// Cloudinary設定をテストするためのデバッグエンドポイント
export async function GET(req: NextRequest) {
  try {
    // 環境変数の状態を確認
    const cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '[SECRET]' : undefined,
    };
    
    console.log('Cloudinary configuration:', cloudinaryConfig);
    
    // Cloudinaryの設定状態を確認
    const configStatus = cloudinary.config();
    const configCheck = {
      cloud_name: configStatus.cloud_name,
      api_key: configStatus.api_key,
      api_secret: configStatus.api_secret ? '[SET]' : '[NOT SET]',
      secure: configStatus.secure
    };
    
    // Cloudinaryの接続をテスト
    let connectionTest;
    try {
      // ping APIを使用して接続テスト
      connectionTest = await cloudinary.api.ping();
    } catch (error) {
      connectionTest = {
        error: true,
        message: error.message,
        details: error
      };
    }
    
    // テストアップロードを試行
    let uploadTest = { success: false, message: 'Not attempted' };
    
    // クエリパラメータでテストアップロードを要求した場合のみ実行
    const testUpload = req.nextUrl.searchParams.get('testUpload');
    if (testUpload === 'true') {
      try {
        // 小さなサンプル画像（Base64エンコード）
        const sampleImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJcIiLEUQAAAABJRU5ErkJggg==';
        
        // テスト用フォルダにアップロード
        const uploadResult = await uploadImage(sampleImage, 'linebuzz/test');
        
        uploadTest = {
          success: true,
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          message: 'テストアップロードが成功しました'
        };
        
        // テスト画像を削除
        await cloudinary.uploader.destroy(uploadResult.publicId);
      } catch (uploadError) {
        uploadTest = {
          success: false,
          message: 'テストアップロードに失敗しました',
          error: uploadError.message,
          details: uploadError
        };
      }
    }
    
    return NextResponse.json({
      env: cloudinaryConfig,
      config: configCheck,
      connectionTest,
      uploadTest,
      timestamp: new Date().toISOString(),
      usage: {
        testUpload: '?testUpload=true クエリパラメータでテストアップロードを実行できます'
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Cloudinaryデバッグエラー:', error);
    return NextResponse.json({
      error: 'Cloudinaryデバッグ中にエラーが発生しました',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
