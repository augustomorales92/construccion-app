import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    ppr: true,
    viewTransition: true,
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
