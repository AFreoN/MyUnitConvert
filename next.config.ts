
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
  env: {
    // Pass the gh-pages flag to the client-side code
    NEXT_PUBLIC_IS_GHPAGES: isGithubActions ? "true" : "",
  },
  // Add the basePath and assetPrefix only when building for GH Pages
  ...(isGithubActions && {
    basePath: `/${repo}`,
    assetPrefix: `/${repo}/`,
  }),
  // Add webpack config to stub out server actions for static export
  webpack: (config) => {
    if (isGithubActions) {
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
