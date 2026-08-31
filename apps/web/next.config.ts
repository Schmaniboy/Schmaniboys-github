import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import type { NextConfig } from 'next';

import { securityHeaders } from './src/lib/security-headers';

/*
 * .env liegt in der Wurzel des Monorepos, nicht in apps/web -- dieselben
 * Werte brauchen auch Prisma und der Worker. Next sucht dort nicht von
 * selbst, deshalb hier ausdruecklich laden.
 */
const rootEnv = resolve(process.cwd(), '../../.env');
if (existsSync(rootEnv)) {
  process.loadEnvFile(rootEnv);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@ap/core', '@ap/db'],
  serverExternalPackages: ['@prisma/client'],
  typedRoutes: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders() }];
  },
};

export default nextConfig;
