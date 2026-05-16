/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/eventflow-pro',
  assetPrefix: '/eventflow-pro',
  trailingSlash: true,
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
    unoptimized: true,
  },
};

export default nextConfig;
