
import type {NextConfig} from 'next';

const repoName = 'MyUnitConvert';

const nextConfig: NextConfig = {
  output: 'export',
  // If your repository is named something else, change 'MyUnitConvert' to your repository name.
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Image optimization is not supported for static exports.
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
