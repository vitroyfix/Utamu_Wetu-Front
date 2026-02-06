/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local Development
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      // Production (Render Backend)
      {
        protocol: "https",
        hostname: "utamu-wetu-back.onrender.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;