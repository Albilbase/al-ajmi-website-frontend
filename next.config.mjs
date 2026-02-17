/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 75, 80, 85, 90],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.15.95',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
};


export default nextConfig;
