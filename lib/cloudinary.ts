import { v2 as cloudinary } from 'cloudinary';

// Cloudinary設定
// 環境変数が正しく読み込まれない問題を修正するために直接値を設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dslf46nht',
  api_key: process.env.CLOUDINARY_API_KEY || '648367882231277',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'UVZjamw53yF0gn9-1xj9HFtYBXc',
  secure: true,
});

console.log('Cloudinary configuration loaded with cloud_name:', cloudinary.config().cloud_name);

// 画像をアップロードする関数
export const uploadImage = async (
  file: string,
  folder: string = 'linebuzz'
): Promise<{ url: string; publicId: string }> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary アップロードエラー:', error);
    throw new Error('画像のアップロードに失敗しました');
  }
};

// 動画をアップロードする関数
export const uploadVideo = async (
  file: string,
  folder: string = 'linebuzz/videos'
): Promise<{ url: string; publicId: string; thumbnail: string }> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'video',
      eager: [
        { format: 'mp4', transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]},
      ],
      eager_async: true,
      eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL,
    });

    // スマートサムネイルURLを生成
    const thumbnailUrl = await generateSmartThumbnail(result.public_id, {
      width: 480,
      height: 270
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      thumbnail: thumbnailUrl,
    };
  } catch (error) {
    console.error('Cloudinary 動画アップロードエラー:', error);
    throw new Error('動画のアップロードに失敗しました');
  }
};

// 動画からサムネイルを生成する関数
export const generateThumbnail = async (
  publicId: string,
  options: { width?: number; height?: number; at?: string } = {}
): Promise<string> => {
  const { width = 480, height = 270, at = '0.5' } = options;
  
  try {
    const thumbnailUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      transformation: [
        { width, height, crop: 'fill', start_offset: at },
        { fetch_format: 'jpg' },
        { quality: 'auto' }
      ]
    });
    
    return thumbnailUrl;
  } catch (error) {
    console.error('サムネイル生成エラー:', error);
    throw new Error('サムネイルの生成に失敗しました');
  }
};

// 動画から複数のサムネイル候補を生成する関数
export const generateMultipleThumbnails = async (
  publicId: string,
  options: { 
    width?: number; 
    height?: number; 
    count?: number;
    quality?: string;
  } = {}
): Promise<string[]> => {
  const { 
    width = 480, 
    height = 270, 
    count = 5,
    quality = 'auto'
  } = options;
  
  try {
    // 動画の長さに応じて均等に分布したタイムスタンプを生成
    const timestamps = Array.from({ length: count }, (_, i) => 
      (i + 1) / (count + 1)
    );
    
    // 各タイムスタンプでサムネイルURLを生成
    const thumbnailUrls = timestamps.map(timestamp => {
      return cloudinary.url(publicId, {
        resource_type: 'video',
        transformation: [
          { width, height, crop: 'fill', start_offset: timestamp.toFixed(2) },
          { fetch_format: 'jpg' },
          { quality }
        ]
      });
    });
    
    return thumbnailUrls;
  } catch (error) {
    console.error('複数サムネイル生成エラー:', error);
    throw new Error('サムネイルの生成に失敗しました');
    return [];
  }
};

// AIを使って動画から最適なサムネイルを生成する関数
export const generateSmartThumbnail = async (
  publicId: string,
  options: { 
    width?: number; 
    height?: number;
  } = {}
): Promise<string> => {
  const { width = 480, height = 270 } = options;
  
  try {
    // Cloudinaryの自動サムネイル生成機能を使用
    const thumbnailUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      transformation: [
        { width, height, crop: 'thumb' }, // 'thumb' は自動的に良いフレームを選択
        { fetch_format: 'auto' },
        { quality: 'auto:good' }
      ]
    });
    
    return thumbnailUrl;
  } catch (error) {
    console.error('スマートサムネイル生成エラー:', error);
    throw new Error('サムネイルの生成に失敗しました');
  }
};

// 複数のメディアをバッチでアップロードする関数
export const uploadBatch = async (
  files: Array<{ file: string; type: 'image' | 'video' }>,
  folder: string = 'linebuzz'
): Promise<Array<{ url: string; publicId: string; type: string; thumbnail?: string }>> => {
  try {
    const results = await Promise.all(
      files.map(async ({ file, type }) => {
        if (type === 'video') {
          const result = await uploadVideo(file, `${folder}/videos`);
          return {
            url: result.url,
            publicId: result.publicId,
            type: 'video',
            thumbnail: result.thumbnail,
          };
        } else {
          const result = await uploadImage(file, `${folder}/images`);
          return {
            url: result.url,
            publicId: result.publicId,
            type: 'image',
          };
        }
      })
    );
    
    return results;
  } catch (error) {
    console.error('バッチアップロードエラー:', error);
    throw new Error('メディアのバッチアップロードに失敗しました');
  }
};

// 画像を削除する関数
export const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary 削除エラー:', error);
    return false;
  }
};

// 動画を削除する関数
export const deleteVideo = async (publicId: string): Promise<boolean> => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    return true;
  } catch (error) {
    console.error('Cloudinary 動画削除エラー:', error);
    return false;
  }
};

// Cloudinaryの変換URL（リサイズ、トリミングなど）を生成する関数
export const getImageUrl = (
  publicId: string, 
  options: { width?: number; height?: number; crop?: string } = {}
): string => {
  const { width, height, crop = 'fill' } = options;
  const transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  
  return cloudinary.url(publicId, {
    transformation: transformations.length ? [transformations.join(',')] : [],
    secure: true,
    format: 'auto',
    quality: 'auto',
  });
};

// 動画のストリーミング最適化URLを生成する関数
export const getVideoUrl = (
  publicId: string,
  options: { quality?: string; format?: string } = {}
): string => {
  const { quality = 'auto', format = 'auto' } = options;
  
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { quality },
      { fetch_format: format }
    ],
    secure: true
  });
};

// 直接cloudinaryをエクスポートして他のファイルで利用可能に
export { cloudinary };

// デフォルトエクスポート
export default cloudinary;
