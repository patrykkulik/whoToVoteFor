import type { NextConfig } from "next";

// When deploying to GitHub Pages at https://<user>.github.io/<repo>/, we need
// a basePath equal to the repo name. Set GITHUB_PAGES=true in the deploy
// workflow; local `next dev` and `next start` keep working without it.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "whoToVoteFor";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isPages ? `/${repo}` : undefined,
  assetPrefix: isPages ? `/${repo}/` : undefined,
};

export default nextConfig;
