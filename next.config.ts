/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./src/app/styles'],
    modules: true,
  },
  images: {
    domains: ['hips.hearstapps.com'],
  },
};

export default nextConfig;
