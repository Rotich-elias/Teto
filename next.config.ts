import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const turnstile = process.env.TURNSTILE_ENABLED === 'true';
const hasMapEmbed = Boolean(process.env.TETO_MAP_EMBED_URL);

/**
 * Content Security Policy. Next.js emits inline bootstrap scripts and inline
 * styles, so `'unsafe-inline'` is required for `script-src`/`style-src` while
 * the app is statically rendered. A nonce-based policy (as the Laravel app
 * used) is stricter but opts every page into dynamic rendering — see README.
 */
function contentSecurityPolicy(): string {
  const scripts = ["'self'", "'unsafe-inline'"];
  const connects = [
    "'self'",
    // The admin page uploads APKs directly from the browser to Vercel Blob.
    'https://blob.vercel-storage.com',
    'https://*.public.blob.vercel-storage.com',
    'https://*.private.blob.vercel-storage.com',
  ];
  const frames: string[] = [];

  if (!isProd) {
    scripts.push("'unsafe-eval'");
    connects.push('ws:', 'wss:');
  }

  if (turnstile) {
    scripts.push('https://challenges.cloudflare.com');
    connects.push('https://challenges.cloudflare.com');
    frames.push('https://challenges.cloudflare.com');
  }

  if (hasMapEmbed) {
    frames.push('https://www.google.com', 'https://maps.google.com');
  }

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scripts.join(' ')}`,
    `connect-src ${connects.join(' ')}`,
  ];

  if (frames.length > 0) directives.push(`frame-src ${frames.join(' ')}`);
  if (isProd) directives.push('upgrade-insecure-requests');

  return `${directives.join('; ')};`;
}

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy() },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
];

if (isProd) {
  securityHeaders.push({ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' });
}

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
