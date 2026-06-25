/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Folder /legacy berisi prototype Vite lama — jangan ikut di-compile.
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
