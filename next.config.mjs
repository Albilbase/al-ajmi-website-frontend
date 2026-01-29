/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 80, 85, 90],
  },
};

export default nextConfig;
