import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // تحسين استهلاك الذاكرة على أجهزة 8GB RAM أثناء التطوير
  experimental: {
    webpackBuildWorker: true,
  },
};

export default nextConfig;
