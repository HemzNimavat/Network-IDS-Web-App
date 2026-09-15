/** @type {import('next').NextConfig} */
const nextConfig = {
  // onnxruntime-web ships a .wasm binary and some Node-specific entry
  // points — keep it external so webpack doesn't try to bundle it.
  experimental: {
    serverComponentsExternalPackages: ["onnxruntime-web"],
  },
};

export default nextConfig;
