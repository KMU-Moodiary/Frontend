/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://moodiary.p-e.kr/api/:path*',
      },
    ];
  },
  reactStrictMode: false,
  output: 'standalone',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
