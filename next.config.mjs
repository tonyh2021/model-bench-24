/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const repoName = "model-bench";

const nextConfig = {
  output: "export", // Static export
  images: {
    unoptimized: true, // Disable image optimization for next export
    loader: "custom",
    loaderFile: "./image-loader.js",
  },
  trailingSlash: true, // All paths end with /, suitable for static hosting
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repoName}` : "",
    // Optional: Build information (recommended to use scripts or external injection for more accuracy)
    NEXT_PUBLIC_BUILD_DATE: new Date()
      .toISOString()
      .split("T")[0],
    NEXT_PUBLIC_BUILD_TIME: new Date()
      .toISOString()
      .split("T")[1]
      .substring(0, 8),
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19),
  },
};

export default nextConfig;
