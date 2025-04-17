/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true }
};

export default nextConfig;
