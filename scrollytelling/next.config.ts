import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/story",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
