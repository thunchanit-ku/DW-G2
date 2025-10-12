/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },     // ข้าม ESLint
  typescript: { ignoreBuildErrors: true },  // ข้าม TypeScript errors
};
export default nextConfig;
