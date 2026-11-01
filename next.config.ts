import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  allowedDevOrigins: [
    "localhost",
    "localhost:3100",
    "127.0.0.1",
    "127.0.0.1:3100",
    "192.168.1.202",
    "192.168.1.202:3100",
  ],
};

export default nextConfig;
