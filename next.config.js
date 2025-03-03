/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // HTMLファイルのローダー設定
    config.module.rules.push({
      test: /\.html$/,
      use: 'null-loader',
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
      'api.dicebear.com'
    ],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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
    },
  },
};

module.exports = nextConfig;
