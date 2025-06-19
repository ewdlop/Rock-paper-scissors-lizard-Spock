/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    SOCKET_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-app.vercel.app' 
      : 'http://localhost:3001'
  }
}

module.exports = nextConfig 