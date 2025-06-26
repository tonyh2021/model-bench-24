export default function imageLoader({
  src,
  width,
  quality,
}) {
  const isProd = process.env.NODE_ENV === "production";
  const repoName = "model-bench";
  const basePath = isProd ? `/${repoName}` : "";

  // If the image is an external URL, return it as is
  if (src.startsWith("http")) {
    return src;
  }

  // For local images, add the basePath
  return `${basePath}${src}`;
}
