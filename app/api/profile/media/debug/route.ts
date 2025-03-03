import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

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
    
    return NextResponse.json({
      env: cloudinaryConfig,
      config: configCheck,
      connectionTest
    }, { status: 200 });
  } catch (error) {
    console.error('Cloudinaryデバッグエラー:', error);
    return NextResponse.json({
      error: 'Cloudinaryデバッグ中にエラーが発生しました',
      details: error.message
    }, { status: 500 });
  }
}
