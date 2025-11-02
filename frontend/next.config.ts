import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['p16-sign-sg.tiktokcdn.com', 'p16-sign.tiktokcdn.com'], // TikTok CDN domains
  },
  reactStrictMode: true,
};

export default nextConfig;
