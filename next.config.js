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
};

module.exports = nextConfig;
