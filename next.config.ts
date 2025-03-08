import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/catch-the-stick-game',
  assetPrefix: '/catch-the-stick-game/',
  trailingSlash: true,
  distDir: 'out',
};

export default nextConfig;
