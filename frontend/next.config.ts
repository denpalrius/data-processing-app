import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Warning: This allows production builds to successfully complete even if
  // the project has ESLint errors.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
