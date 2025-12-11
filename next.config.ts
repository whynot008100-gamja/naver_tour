import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { 
        protocol: "https",
        hostname: "tong.visitkorea.or.kr",
      },
      { 
        protocol: "http",
        hostname: "tong.visitkorea.or.kr",
      },
    ],
  },
};

export default nextConfig;
