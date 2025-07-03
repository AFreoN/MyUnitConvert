
import type {NextConfig} from 'next';

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
};

export default nextConfig;
