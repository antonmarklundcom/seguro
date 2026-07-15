import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@seguro/ui", "@seguro/config", "@seguro/shared"],
  reactStrictMode: true,
};

export default nextConfig;
