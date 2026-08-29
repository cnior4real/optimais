import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  },
  // vercel.json's cleanUrls only rewrites these in production; add the same
  // mapping here so the extensionless links in optimais-landing.tsx also
  // resolve to their public/*.html pages in local dev.
  async rewrites() {
    return [
      { source: "/deep-tech", destination: "/deep-tech.html" },
      { source: "/culture-benefits", destination: "/culture-benefits.html" },
      { source: "/our-stories", destination: "/our-stories.html" }
    ];
  }
};

export default nextConfig;
