/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL || 'http://localhost:3000'
  },
  webpack: (config, { isServer }) => {
    // HTMLファイルのローダー設定
    config.module.rules.push({
      test: /\.html$/,
      use: 'null-loader',
    });
    
    // node_modulesのtranspile設定
    config.module.rules.push({
      test: /\.js$/,
      include: [
        /node_modules\/@radix-ui/,
        /node_modules\/class-variance-authority/
      ],
      use: { loader: 'babel-loader' }
    });
    
    return config;
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'randomuser.me',
      'images.unsplash.com',
      'cloudinary.com',
      'res.cloudinary.com',
      'picsum.photos',
      'api.dicebear.com',
      'commondatastorage.googleapis.com',
      'peach.blender.org'
    ],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    unoptimized: true
  },
  eslint: {
    // 本番ビルド時にESLintエラーを無視する
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 本番ビルド時に型チェックエラーを無視する
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002', 'localhost:3003']
    }
  },
  // 静的エクスポートを無効にする
  output: 'standalone'
};

module.exports = nextConfig;
