import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@seguro/ui", "@seguro/config", "@seguro/shared", "@seguro/tracking"],
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "mdx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
