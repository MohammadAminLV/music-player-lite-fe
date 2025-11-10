/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.aparat.com'
      },
    ],
  },
};

export default nextConfig;
