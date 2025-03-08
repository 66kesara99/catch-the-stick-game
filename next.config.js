/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: '/catch-the-stick-game', // Replace with your repository name
  assetPrefix: '/catch-the-stick-game/', // Replace with your repository name
}

module.exports = nextConfig 