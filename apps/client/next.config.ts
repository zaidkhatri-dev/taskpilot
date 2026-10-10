import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  /**
   * images.remotePatterns — required before using <Image src="https://...">
   * for any remote URL. Without this, Next.js throws a runtime error.
   * Add an entry here for each external image source as they are confirmed
   * (e.g. S3 bucket for user avatars, Cloudflare R2 for task attachments).
   *
   * Example entry:
   * { protocol: "https", hostname: "**.s3.amazonaws.com" }
   */
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
