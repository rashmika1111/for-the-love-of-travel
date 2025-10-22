/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/**' },
      { protocol: 'https', hostname: 'localhost', port: '3000', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '3002', pathname: '/**' },
      { protocol: 'https', hostname: 'localhost', port: '3002', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '5000', pathname: '/**' },
      { protocol: 'https', hostname: 'localhost', port: '5000', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
