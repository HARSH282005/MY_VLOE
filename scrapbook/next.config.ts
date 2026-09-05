import type { NextConfig } from "next";
import million from "million/compiler";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Required for Transformers.js background removal in browser
    config.resolve.alias = {
        ...config.resolve.alias,
        "sharp$": false,
        "onnxruntime-node$": false,
    }
    return config;
  }
};

export default million.next(nextConfig, { auto: { rsc: true } });
