
import type {NextConfig} from 'next';
import path from 'path';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const repo = 'MyUnitConvert';

const nextConfig: NextConfig = {
  output: 'export',
  // When deploying to Github Pages, the images need to be unoptimized
  images: {
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
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add the basePath and assetPrefix only when building for GH Pages
  ...(isGithubActions && {
    basePath: `/${repo}`,
    assetPrefix: `/${repo}/`,
  }),
  // Add webpack config to stub out server actions for static export
  webpack: (config, { isServer }) => {
    if (process.env.NEXT_PUBLIC_IS_GHPAGES === 'true' && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/ai/flows/auto-detect-conversion': path.resolve(
          __dirname,
          'src/ai/flows/auto-detect-conversion.dummy.ts'
        ),
      };
    }
    return config;
  },
};

export default nextConfig;
