/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sedaems.ams3.cdn.digitaloceanspaces.com",
      },
    ],
  },
};

export default nextConfig;
