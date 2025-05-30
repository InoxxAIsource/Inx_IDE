/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Removed appDir as it's now the default in Next.js 15+
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
