/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // evita la optimización automática que consume memoria
  },
};

module.exports = nextConfig;
