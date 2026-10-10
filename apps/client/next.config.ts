import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/certification", "@repo/faq"],
};

export default nextConfig;
