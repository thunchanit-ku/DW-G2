/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },     // ข้าม ESLint
  typescript: { ignoreBuildErrors: true },  // ข้าม TypeScript errors
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};
export default nextConfig;
