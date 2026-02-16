/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /** Export estático para hosting compartido (FTP / public_html) */
  output: "export",
  /** Sin optimización de imágenes en export estático (no hay servidor /_next/image) */
  images: { unoptimized: true },
};

module.exports = nextConfig;
